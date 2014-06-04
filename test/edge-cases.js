"use strict"

var tape = require("tape")
var rblsi = require("../rblsi")

tape("vertical-lines", function(t) {

  var red = [
    [ [ 224, 328 ], [ 224, 331 ] ] ]
  var blue = [
    [ [ 224, 146 ], [ 224, 330] ] ]

  t.ok(rblsi(red, blue, function(r,b) {
    return true
  }))

  t.end()
})