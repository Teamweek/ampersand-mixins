# Ampersand-mixins

Ampersand-mixins allows you to mix in multiple mixins while merging all of the magic AmpersandJS properties.

AmpersandJS provides an `extend` function for most of its modules. It offers amazing functionality like automatic props merging and etc.

One of the shortcomings of this is approach that it makes mixins more complicated. You can extend mixins like this `State.extend(parent, mixin1, mixin2, {})` however it does not merge props, derived and etc. This is where Ampersand-mixins comes to help.

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
