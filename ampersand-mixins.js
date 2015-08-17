var forEach = require('lodash.foreach');
var assign = require('lodash.assign');
var omit = require('lodash.omit');
var isString = require('lodash.isstring');
var isArray = require('lodash.isarray');
var isUndefined = require('lodash.isundefined');
var result = require('lodash.result');

module.exports = function (target, mixins, options) {
  options = assign({
    invoke: []
  }, options);

  var mixinFunctions = {};

  forEach(options.invoke, function (fnName) {
    mixinFunctions[fnName] = [];
  });

  var omitFromAssign = [
    'dataTypes', 'props', 'session', 'derived', 'collections', 'children',
    'events'
  ].concat(options.invoke);

  target.prototype.events = target.prototype.events || {};
  target.prototype.bindings = target.prototype.bindings || {};

  forEach(mixins, function (mixin) {
    if (mixin.dataTypes) {
      forEach(mixin.dataTypes, function (def, name) {
        target.prototype._dataTypes[name] = def;
      });
    }
    if (mixin.props) {
      forEach(mixin.props, function (def, name) {
        createPropertyDefinition(target.prototype, name, def);
      });
    }
    if (mixin.session) {
      forEach(mixin.session, function (def, name) {
        createPropertyDefinition(target.prototype, name, def, true);
      });
    }
    if (mixin.derived) {
      forEach(mixin.derived, function (def, name) {
        createDerivedProperty(target.prototype, name, def);
      });
    }
    if (mixin.collections) {
      forEach(mixin.collections, function (constructor, name) {
        target.prototype._collections[name] = constructor;
      });
    }
    if (mixin.children) {
      forEach(mixin.children, function (constructor, name) {
        target.prototype._children[name] = constructor;
      });
    }
    if (mixin.events) {
      assign(target.prototype.events, mixin.events);
    }
    if (mixin.bindings) { // TODO: Make it work with arrays
      assign(target.prototype.bindings, mixin.bindings);
    }

    assign(target.prototype, omit(mixin, omitFromAssign));

    forEach(options.invoke, function (fnName) {
      var fn = mixin[fnName]
      if (fn) {
        mixinFunctions[fnName].push(fn);
      }
    });
  });

  forEach(options.invoke, function (fnName) {
    var functions = mixinFunctions[fnName];
    if (functions.length > 0) {
      var realFn = target.prototype[fnName];
      target.prototype[fnName] = function () {
        var args = [].slice.call(arguments)
          , self = this
          , result;

        if (realFn) {
          result = realFn.apply(this, args);
        }

        forEach(functions, function (fn) {
          fn.apply(self, args);
        });

        return result;
      }
    }
  });
};

/* This is copied from ampersand-state */

// helper for creating/storing property definitions and creating
// appropriate getters/setters
function createPropertyDefinition(object, name, desc, isSession) {
  var def = object._definition[name] = {};
  var type, descArray;

  if (isString(desc)) {
    // grab our type if all we've got is a string
    type = object._ensureValidType(desc);
    if (type) def.type = type;
  } else {

    //Transform array of ['type', required, default] to object form
    if (isArray(desc)) {
      descArray = desc;
      desc = {
        type: descArray[0],
        required: descArray[1],
        'default': descArray[2]
      };
    }

    type = object._ensureValidType(desc.type);
    if (type) def.type = type;

    if (desc.required) def.required = true;

    if (desc['default'] && typeof desc['default'] === 'object') {
      throw new TypeError('The default value for ' + name + ' cannot be an object/array, must be a value or a function which returns a value/object/array');
    }

    def['default'] = desc['default'];

    def.allowNull = desc.allowNull ? desc.allowNull : false;
    if (desc.setOnce) def.setOnce = true;
    if (def.required && isUndefined(def['default']) && !def.setOnce) def['default'] = object._getDefaultForType(type);
    def.test = desc.test;
    def.values = desc.values;
  }
  if (isSession) def.session = true;

  // define a getter/setter on the prototype
  // but they get/set on the instance
  Object.defineProperty(object, name, {
    set: function (val) {
      this.set(name, val);
    },
    get: function () {
      if (!this._values) {
        throw Error('You may be trying to `extend` a state object with "' + name + '" which has been defined in `props` on the object being extended');
      }
      var value = this._values[name];
      var typeDef = this._dataTypes[def.type];
      if (typeof value !== 'undefined') {
        if (typeDef && typeDef.get) {
          value = typeDef.get(value);
        }
        return value;
      }
      value = result(def, 'default');
      this._values[name] = value;
      return value;
    }
  });

  return def;
}

/* This is copied from ampersand-state */

// helper for creating derived property definitions
function createDerivedProperty(modelProto, name, definition) {
  var def = modelProto._derived[name] = {
    fn: isFunction(definition) ? definition : definition.fn,
    cache: (definition.cache !== false),
    depList: definition.deps || []
  };

  // add to our shared dependency list
  forEach(def.depList, function (dep) {
    modelProto._deps[dep] = union(modelProto._deps[dep] || [], [name]);
  });

  // defined a top-level getter for derived names
  Object.defineProperty(modelProto, name, {
    get: function () {
      return this._getDerivedProperty(name);
    },
    set: function () {
      throw new TypeError('"' + name + '" is a derived property, it can\'t be set directly.');
    }
  });
}
