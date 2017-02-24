[![Build Status](https://travis-ci.org/Macmee/private-scope.svg?branch=master)](https://travis-ci.org/Macmee/private-scope)

##What is this?

This module gives javacript objects a private only scope.

##Examples

Regular JavaScript objects:

```javascript
require('private-scope');

const test = {
  getX: function() {
    return this.private.x;
  },
  setX: function(x) {
    this.private.x = x;
  }
};

test.private.x = 5; // TypeError: cannot find x of undefined
test.setX(100);
console.log(test.private.x); // TypeError: cannot find x of undefined
console.log(test.getX()); // 100

```

Classes:

```javascript
require('private-scope');

class TestClass {
  getX() {
    return this.private.x;
  }
  setX(x) {
    this.private.x = x;
  }
  constructor() {
    this.private.y = 2;
  }
};

const test = new TestClass();
test.private.x = 5; // TypeError: cannot find x of undefined
test.setX(100);
console.log(test.private.x); // TypeError: cannot find x of undefined
console.log(test.getX()); // 100
```

Prototypes:

```javascript
require('private-scope');

function TestClass() {
  this.private.y = 53;
}

TestClass.prototype.getX = function() {
  return this.private.x;
}

TestClass.prototype.setX = function(x) {
  this.private.x = x;
}

TestClass.prototype.getY = function() {
  return this.private.y;
}

const test = new TestClass();
test.private.x = 5; // TypeError: cannot find x of undefined
test.setX(100);
console.log(test.private.x); // TypeError: cannot find x of undefined
console.log(test.getX()); // 100
console.log(test.getY()); // 53
```

##Why?

Lets say you organized your object like so:

```javascript
const test = {

  private: {},

  getX: function() {
    return this.private.x;
  },

  setX: function(x) {
    this.private.x = x;
  }

};
```

Sure you can do `test.getX()` and `test.setX(12)` here but you can just as easily do `test.private.x` and there’s nothing stopping you from doing the latter even outside of an internal function on `test` such as from within `getX` and `setX`. After you include this module into your project, `test.private.x` is not allowed.

##Are You Crazy?

Probably. And my solution isn't bulletproof. This solution leverages `Function.caller` behind the scenes so things can get funky when that's not available. I'm using a slight workaround for objects created via the `class` keyword too (stack inspection) to determine if a caller belongs to a class due to the absence of `Function.caller` in methods created using `class`.

