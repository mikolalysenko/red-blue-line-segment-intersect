"use strict"

var NUM_ITER = 100
var WARM_UP = 10

var implementations = [
  { name: "Brute-force", algo: require("./brute_force") },
  { name: "RBLSI", algo: require("./rblsi") }
]

var cases = require("./cases")

function benchmark(red, blue, algo) {
  for(var i=0; i<WARM_UP; ++i) {
    algo(red, blue)
  }
  var start = Date.now()
  var count = 0
  for(var i=0; i<NUM_ITER; ++i) {
    var result = algo(red, blue)
    count += result.length
  }
  var end = Date.now()
  return [ (end - start) / NUM_ITER, count ]
}

for(var i=0; i<implementations.length; ++i) {
  var impl = implementations[i]
  console.log("testing", impl.name, "...")
  for(var j=0; j<cases.length; ++j) {
    console.log("case:", cases[j].name)
    var res = benchmark(cases[j].red, cases[j].blue, impl.algo)
    console.log("time:", res[0], "ms - total isect:", res[1])
  }
}