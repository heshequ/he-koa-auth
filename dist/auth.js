'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var mysql = require('he-mysql');

/**
 * 验证用户token，如果不存在auth，或没有此用户，则返回验证失败
 * @param {MysqlPool} pool mysql连接池对象
 */
module.exports = function (pool) {
  var _this = this;

  return function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
      var error, token, sql, arg, user;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // 定义error字符串
              error = '{"result": "error", "msg": "token validate error", "code": 5001}';

              // 如果不存在ctx.header.authorization，则直接返回error，退出

              if (!_.isNil(ctx.header.authorization)) {
                _context.next = 4;
                break;
              }

              ctx.body = error;
              return _context.abrupt('return');

            case 4:

              // 取token字符串
              token = _.replace(ctx.header.authorization, 'Basic ', '');

              // 读取数据库取回存在该数据库中的用户数据

              sql = ['select * from user where token=?'];
              arg = [token];
              _context.next = 9;
              return mysql.query(pool, sql, arg);

            case 9:
              user = _context.sent;

              if (!(user[0].length == 0)) {
                _context.next = 13;
                break;
              }

              ctx.body = error;
              return _context.abrupt('return');

            case 13:

              // 存在用户，添加ctx.user属性，并next
              ctx.user = user[0][0];
              _context.next = 16;
              return next();

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};