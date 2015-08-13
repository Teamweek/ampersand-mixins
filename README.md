# Ampersand-mixins

Use Ampersand-mixins to mix multiple mixins into a single Ampersand object. Ampersand-mixins merges all Ampersand specific properties such as props, events, bindings, etc.

Ampersand provides an extend function for most of its modules. It offers functionality like automatic props merging and etc.

One of the shortcomings of this approach is that it allows to extend only one object. Ampersand.extend also allows for mixins but it doesn't merge any of their properties. This is where Ampersand-mixins comes to help.

## Install

```
npm install ampersand-mixins
```

## Usage

### mixins(target, [mixins], options)

```javascript
var mixins = require('ampersand-mixins');

var SomeView = View.extend({
  props: {
    foo: 'string',
  },
  events: {
    'click button': 'clickButton',
  },
);

var mixin1 = {
  props: {
    bar: 'boolean',
  },
  events: {
    'click a': 'clickAnchor',
  },
  clickButton: function () {}
};

var mixin2 = {
  props: {
    foobar: 'state',
  },
  clickAnchor: function () {}
};

mixins(SomeView, [mixin1, mixin2]);
```
## Options
### Invoke
An array of function names that define functions that will be called on each mixin (and the base object) separately. Useful for binding mixin specific listeners in the initialize function. Also works with the render function or any other custom functions. Only invokes functions that exist and doesn't fail if the base object or any of the mixins don't share the same functions.
```javascript
var mixins = require('ampersand-mixins');

var BaseView = View.extend({
  initialize: function () { console.log('base'); }
);

var mixin1 = {
  initialize: function () { console.log('mixin1'); }
};

var mixin2 = {
  initialize: function () { console.log('mixin2'); }
};

mixins(BaseView, [mixin1, mixin2], {
  invoke: ['initialize']
});
var base = new BaseView();
/* Prints out:
 * base
 * mixin1
 * mixin2
 */
```

