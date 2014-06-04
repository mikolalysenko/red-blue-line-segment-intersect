"use strict"

var ndscratch = require("ndarray-scratch")
var pool = require("typedarray-pool")
var ndsort = require("ndarray-sort")
var testIntersect = require("robust-segment-intersect")

var CREATE_RED = 0
var CREATE_BLUE = 1
var REMOVE_RED = 2
var REMOVE_BLUE = 3

module.exports = redBlueLineSegmentIntersection

function prepareEvents(red, blue) {
  var nr = red.length
  var nb = blue.length
  var n = nr + nb
  var i0 = 0
  var list = ndscratch.malloc([2*n, 3])
  var data = list.data
  var ptr = 0
  for(var i=0; i<nr; ++i) {
    var seg = red[i]
    var x = seg[0][0]
    var y = seg[1][0]

    data[ptr++] = Math.min(x,y)
    data[ptr++] = CREATE_RED
    data[ptr++] = i
    
    data[ptr++] = Math.max(x,y)
    data[ptr++] = REMOVE_RED
    data[ptr++] = i
  }
  for(var i=0; i<nb; ++i) {
    var seg = blue[i]
    var x = seg[0][0]
    var y = seg[1][0]

    data[ptr++] = Math.min(x,y)
    data[ptr++] = CREATE_BLUE
    data[ptr++] = i
    
    data[ptr++] = Math.max(x,y)
    data[ptr++] = REMOVE_BLUE
    data[ptr++] = i
  }
  ndsort(list)
  return list
}

//It is silly, but this is faster than doing the right thing for up to a
//few thousand segments, which hardly occurs in practice.
function BruteForceList(capacity) {
  this.intervals = pool.mallocDouble(2 * capacity)
  this.index = pool.mallocInt32(capacity)
  this.count = 0
}

var proto = BruteForceList.prototype

proto.insert = function(lo, hi, index) {
  var count = this.count
  this.index[count] = index
  this.intervals[2*count] = lo
  this.intervals[2*count+1] = hi
  this.count += 1
}

proto.remove = function(index) {
  var count = this.count
  var rindex = this.index
  var intervals = this.intervals
  for(var i=count-1; i>=0; --i) {
    if(rindex[i] === index) {
      rindex[i] = rindex[count-1]
      intervals[2*i] = intervals[2*(count-1)]
      intervals[2*i+1] = intervals[2*count-1]
      this.count -= 1
      return
    }
  }
}

proto.dispose = function() {
  pool.freeDouble(this.intervals)
  pool.freeInt32(this.index)
}

function addSegment(index, red, redList, blue, blueList, visit, flip) {
  //Convert flip to boolean
  flip = !!flip

  //Make sure index is integer
  index = index|0

  //Look up segment
  var seg = red[index]

  //Get segment end points
  var x0 = seg[0]
  var x1 = seg[1]

  //Read out components
  var a0 = x0[1]
  var a1 = x1[1]
  var l0 = Math.min(a0, a1)
  var h0 = Math.max(a0, a1)

  //Scan over blue intervals for point
  var intervals = blueList.intervals
  var blueIndex = blueList.index
  var count = blueList.count
  var ptr = 2*count
  for(var i=count-1; i>=0; --i) {
    var h1 = intervals[--ptr]
    var l1 = intervals[--ptr]

    //Test if intervals overlap
    if(l0 <= h1 && l1 <= h0) {
      var bindex = blueIndex[i]
      var bseg = blue[bindex]

      //Test if segments intersect
      if(testIntersect(x0, x1, bseg[0], bseg[1])) {
        var ret
        if(flip) {
          ret = visit(bindex, index)
        } else {
          ret = visit(index, bindex)
        }
        if(ret) {
          return ret
        }
      }
    }
  }

  //Then add to red list
  redList.insert(l0, h0, index)
}

function redBlueLineSegmentIntersection(red, blue, visit) {
  var nr = red.length
  var nb = blue.length
  var n = nr + nb
  var ne = 2 * n
  var events = prepareEvents(red, blue)
  var redList = new BruteForceList(nr)
  var blueList = new BruteForceList(nb)
  var ret

  for(var i=0; i<ne; ++i) {
    var index = events.get(i, 2)|0
    switch(events.get(i, 1)|0) {
      case CREATE_RED:
        ret = addSegment(index, red, redList, blue, blueList, visit, false)
      break
      case CREATE_BLUE:
        ret = addSegment(index, blue, blueList, red, redList, visit, true)
      break
      case REMOVE_RED:
        redList.remove(index)
      break
      case REMOVE_BLUE:
        blueList.remove(index)
      break
    }
    if(ret) {
      break
    }
  }

  ndscratch.free(events)
  redList.dispose()
  blueList.dispose()
  return ret
}