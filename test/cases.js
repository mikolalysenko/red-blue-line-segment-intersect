"use strict"

var tape = require("tape")
var brutal = require("../bench/brute_force")
var rblsi = require("../bench/rblsi")
var cases = require("../bench/cases")

cases.forEach(function(testCase) {
  tape(testCase.name, function(t) {
    var expected = brutal(testCase.red, testCase.blue)
    expected.sort()
    
    var actual = rblsi(testCase.red, testCase.blue)
    actual.sort()

    t.same(actual, expected)
    t.end()
  })
})