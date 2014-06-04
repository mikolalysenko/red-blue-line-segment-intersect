"use strict"

var intersect = require("../rblsi.js")

module.exports = intersectBruteForce

function intersectBruteForce(red, blue) {
  var crossings = []
  intersect(red, blue, function(i,j) {
    crossings.push([i,j])
  })
  return crossings
}