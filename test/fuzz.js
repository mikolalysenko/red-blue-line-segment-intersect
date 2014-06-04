"use strict"

var tape = require("tape")
var brutal = require("../bench/brute_force")
var rblsi = require("../bench/rblsi")

tape("fuzz test", function(t) {

  for(var j=0; j<10; ++j) {

    var red = []
    for(var i=0; i<10*(j+1); ++i) {
      red.push( [
          [Math.random(), Math.random()],
          [Math.random(), Math.random()]
        ])
    }
    var blue = []
    for(var i=0; i<10*(j+1); ++i) {
      blue.push( [
          [Math.random(), Math.random()],
          [Math.random(), Math.random()]
        ])
    }

    var expected = brutal(red, blue)
    expected.sort()
    
    var actual = rblsi(red, blue)
    actual.sort()

    t.same(actual, expected, "fuzz test")
  }

  t.end()
})