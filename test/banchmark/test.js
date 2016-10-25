var Benchmark = require('benchmark')
var suite = new Benchmark.Suite

var a = function(str) {
  return str + '_'
}

var b = function(str) {
  return str + '_' + '|'
}

// add tests
suite.add('a', function() {
  a('Hello World!')
})
.add('a', function() {
  b('Hello World!')
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });