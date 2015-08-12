# Ampersand-mixins

AmpersandJS provides an `extend` function for most of its modules. It gives us amazing functionality like automatic props, derived, children, events and bindings merging.

One of the shortcomings of this is that it makes mixins more complicated. By default you can extend mixins like this `State.extend(parent, mixin1, mixin2, {})` however this does not merge props, derived and etc. This is where Ampersand-mixins comes to help.

Ampersand-mixins allows you to mix in multiple mixins while merging all of the magic AmpersandJS properties.

## Install

```
npm install ampersand-mixins
```

## Usage

```javascript
var mixins = require('ampersand-mixins');

var SomeView = View.extend({/*....*/});
mixins(SomeView, mixin1, mixin2, mixin3);
```
