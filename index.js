(function() {

  // because this file uses Function.caller it cannot be strict and thus cannot
  // use const or let as njs 5 and down wont allow it outside strict mode 

  var has_private_scope_cache = new WeakMap();

  /**
   * Given a function, determines if said function accesses the this.private property
   * @param {Function} fn the function we scan to determine if it uses private scope
   * @return {Boolean} true if given function uses private scope and false if not
   */

  function object_has_private_scope(fn) {
    if (has_private_scope_cache.has(fn)) {
      return has_private_scope_cache.get(fn);
    } else {
      var has_scope = (fn.toString().indexOf('this.private') > -1);
      has_private_scope_cache.set(fn, has_scope);
      return has_scope;
    }
  }

  /**
   * Given a class, check if the function invoked a given amount of functions ago
   * on the stack belongs to said class. This has caveats. Namely if you have
   * an identically named class with an indentically named function, this
   * will return a false positive
   * @param {Object} target_class an instance of a class which we are checking if the function belongs to
   * @param {Number} calls_ago_to_check the amount of functions to crawl back in on the stack to check
   *                                    and see if it belongs to target_class. Not including this
   *                                    method call itself. Must be non negative, and 0 refers
   *                                    to the caller of this method itself.
   * @return {Boolean} true if given function uses private scope
   */

  function class_has_private_scope(target_class, calls_ago_to_check) {
    // attempt to extract the caller's class from the current callstack
    // add 2 because the first line is "Error:" and the second line is this method itself
    var stack_line = (new Error().stack.split('\n')[2 + calls_ago_to_check]) || '';
    var class_name = stack_line.match(/at (.*?)\./)[1] || '';
    // the target class we are looking for
    var target_class_name = target_class.constructor.name;
    // make sure also to consider the case of "this.private" in a constructor by checking "new ClassName"
    return (class_name == target_class_name) || (-1 < stack_line.indexOf('new ' + target_class_name));
  }

  var private_scopes = new WeakMap();

  /**
   * Given an object, return its private scope
   * @param {Object} an object we want to retrieve the private scope for
   * @return {Object} hash representing the private scope for an object
   */

  function private_scope_for_object(object) {
    if (private_scopes.has(object)) {
      return private_scopes.get(object);
    } else {
      var space = {};
      private_scopes.set(object, space);
      return space;
    }
  }

  /**
   * returns an caller's private scope OR returns undefined if said caller isnt allowed said scope
   * WARNING: this method depends on 'this' and 'arguments' since its assigned as a getter
   * @return {Object} a hash representing the private scope for an object or undefined
   */

  function private_scope_for_caller() {
    // find whoever called the method and therefor asked for private scope
    var caller = arguments.callee.caller;
    // assume if caller is undefined that the object is a class
    var private_scope = caller ? object_has_private_scope(caller) : class_has_private_scope(this, 1);
    if (private_scope) {
      return private_scope_for_object(this);
    } else {
      return undefined;
    }
  }

  if (!Object.prototype.hasOwnProperty('private')) {
    Object.defineProperty(Object.prototype, 'private', {
      enumerable: false,
      configurable: false,
      set: function(data) {},
      get: private_scope_for_caller
    });
  }

})();