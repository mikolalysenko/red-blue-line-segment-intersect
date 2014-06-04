red-blue-line-segment-intersect
===============================
Given two sets of line segments, find all pairs of intersections between the two of them.

[![testling badge](https://ci.testling.com/mikolalysenko/red-blue-line-segment-intersect.png)](https://ci.testling.com/mikolalysenko/red-blue-line-segment-intersect)

[![build status](https://secure.travis-ci.org/mikolalysenko/red-blue-line-segment-intersect.png)](http://travis-ci.org/mikolalysenko/red-blue-line-segment-intersect)

# Example

```javascript
var findIntersections = require("red-blue-line-segment-intersect")

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
```

Output:

```
segments [ [ 0, 0 ], [ 10, 10 ] ] [ [ 1, 0 ], [ 1, 8 ] ] intersect
```

# Install

```
npm install red-blue-line-segment-intersect
```

# API

#### `require("red-blue-line-segment-intersect")(red, blue, visit)`
Finds all pair of segments between `red` and `blue` which intersect.

* `red` is a list of line segments encoded as pairs of length 2 arrays
* `blue` is a second list of line segments
* `visit(r,b)` is a function which is called once for each pair of line segments that intersect.  If `visit` returns truthy value, then iteration is terminated and that value is returned from the traversal.

**Returns** The return value of the last call to `visit`, or `undefined` otherwise.

# Credits
(c) 2013-2014 Mikola Lysenko. MIT License