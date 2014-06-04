var findIntersections = require("../rblsi")

var red = [
  [[0, 0], [10, 10]],
  [[10, 10], [10, 0]]
]

var blue = [
  [[1,0], [1, 8]]
]

findIntersections(red, blue, function(r, b) {
  console.log("segments", red[r], blue[b], "intersect")
})