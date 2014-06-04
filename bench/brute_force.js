"use strict"

var crosses = require("robust-segment-intersect")

module.exports = intersectBruteForce

function intersectBruteForce(red, blue) {
  var nr = red.length
  var nb = blue.length
  var crossings = []

  for(var i=0; i<nr; ++i) {
    var rseg = red[i]
    var a = rseg[0]
    var b = rseg[1]
    for(var j=0; j<nb; ++j) {
      var bseg = blue[j]
      var c = bseg[0]
      var d = bseg[1]
      if(crosses(a, b, c, d)) {
        crossings.push([i, j])
      }
    }
  }

  return crossings
}