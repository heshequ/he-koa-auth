const _ = require('lodash')
const mysql = require('he-mysql')

/**
 * 验证用户token，如果不存在auth，或没有此用户，则返回验证失败
 * @param {MysqlPool} pool mysql连接池对象
 */
module.exports = function (pool) {
  return async (ctx, next) => {
    // 定义error字符串
    let error = '{"result": "error", "msg": "token validate error", "code": 5001}'
    
    // 如果不存在ctx.header.authorization，则直接返回error，退出
    if (_.isNil(ctx.header.authorization)) {
      ctx.body = error
      return
    }

    // 取token字符串
    let token = _.replace(ctx.header.authorization, 'Basic ', '')
    
    // 读取数据库取回存在该数据库中的用户数据
    let sql = ['select * from user where token=?']
    let arg = [token]
    let user = await mysql.query(pool, sql, arg)

    // 如果不存在此用户，则返回error，退出
    if (user[0].length == 0) {
      ctx.body = error
      return
    } 

    // 存在用户，添加ctx.user属性，并next
    ctx.user = user[0][0]
    await next()
  }
}
