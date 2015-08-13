# Ampersand-mixins

Ampersand-mixins allows you to mix in multiple mixins while merging all of the magic AmpersandJS properties.

AmpersandJS provides an `extend` function for most of its modules. It offers amazing functionality like automatic props merging and etc.

One of the shortcomings of this is approach that it makes mixins more complicated. You can extend mixins like this `State.extend(parent, mixin1, mixin2, {})` however it does not merge props, derived and etc. This is where Ampersand-mixins comes to help.

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
### Options
#### Invoke
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

mixins(BaseView, [mixin1, mixin2]);
var base = new BaseView();
/* Prints out:
 * base
 * mixin1
 * mixin2
 */
```

