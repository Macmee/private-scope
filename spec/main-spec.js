'use strict';

require('../index.js');

describe("Private scope should work for regularly created objects", function() {

  const test = {
    getX: function() {
      return this.private.x;
    },
    setX: function(x) {
      this.private.x = x;
    }
  };

  it("should create a usable private scope", function() {
    expect(test.getX()).toEqual(undefined);
    test.setX(12);
    expect(test.getX()).toEqual(12);
  });

  it("should not allow public access to set in the private scope", function() {
    let error = null;
    try {
      test.private.x = 55;
    } catch (type_error) {
      error = type_error;
    }
    expect(error).not.toEqual(null);
    expect(test.getX()).toEqual(12);
  });

  it("should not allow public access to get in the private scope", function() {
    let error = null;
    try {
      test.private.x;
    } catch (type_error) {
      error = type_error;
    }
    expect(error).not.toEqual(null);
  });

});

describe("Private scope should work for class created objects", function() {

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

  it("should create a usable private scope", function() {
    expect(test.getX()).toEqual(undefined);
    test.setX(12);
    expect(test.getX()).toEqual(12);
  });

  it("should not allow public access to set in the private scope", function() {
    let error = null;
    try {
      test.private.x = 55;
    } catch (type_error) {
      error = type_error;
    }
    expect(error).not.toEqual(null);
    expect(test.getX()).toEqual(12);
  });

  it("should not allow public access to get in the private scope", function() {
    let error = null;
    try {
      test.private.x;
    } catch (type_error) {
      error = type_error;
    }
    expect(error).not.toEqual(null);
  });

});

describe("Private scope should work for prototyped objects", function() {

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

  it("should create a usable private scope", function() {
    expect(test.getX()).toEqual(undefined);
    test.setX(12);
    expect(test.getX()).toEqual(12);
  });

  it("should not allow public access to set in the private scope", function() {
    let error = null;
    try {
      test.private.x = 55;
    } catch (type_error) {
      error = type_error;
    }
    expect(error).not.toEqual(null);
    expect(test.getX()).toEqual(12);
  });

  it("should not allow public access to get in the private scope", function() {
    let error = null;
    try {
      test.private.x;
    } catch (type_error) {
      error = type_error;
    }
    expect(error).not.toEqual(null);
  });

  it("should work with private scoping from the constructor", function() {
    expect(test.getY()).toEqual(53);
  });

});