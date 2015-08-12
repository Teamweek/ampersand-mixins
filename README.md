# Ampersand-mixins

Ampersand-mixins allows you to mix in multiple mixins while merging all of the magic AmpersandJS properties.

AmpersandJS provides an `extend` function for most of its modules. It offers amazing functionality like automatic props merging and etc.

One of the shortcomings of this is approach that it makes mixins more complicated. You can extend mixins like this `State.extend(parent, mixin1, mixin2, {})` however it does not merge props, derived and etc. This is where Ampersand-mixins comes to help.

## Install

```
npm install ampersand-mixins
```

## Usage

### mixins(target, mixins...)

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

mixins(SomeView, mixin1, mixin2);
```
