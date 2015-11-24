'use strict';
var assert = require('assert');
var Md = require('markdown-it');
var markdownItAttrs = require('./');
var utils = require('./utils.js');

describe('markdown-it-attrs.utils', function() {
  it('should parse {.class #id key=val}', function () {
    var src = '{.red #head key=val}';
    var expected = [['class', 'red'], ['id', 'head'], ['key', 'val']];
    var res = utils.getAttrs(src, 1, src.length-1);
    assert.deepStrictEqual(res, expected);
  });

});

describe('markdown-it-attrs', function() {
  var md;
  beforeEach(function(){
    md = Md().use(markdownItAttrs);
  });

  it('should add attributes when {} in end of last inline', function () {
    var src = 'some text {with=attrs}';
    var expected = '<p with="attrs">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add attributes when {} in last line', function () {
    var src = 'some text\n{with=attrs}';
    var expected = '<p with="attrs">some text\n</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add classes with {.class} dot notation', function () {
    var src = 'some text {.green}';
    var expected = '<p class="green">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add identifiers with {#id} hashtag notation', function () {
    var src = 'some text {#section2}';
    var expected = '<p id="section2">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should support classes, identifiers and attributes in same {}', function () {
    var src = 'some text {attr=lorem .class #id}';
    var expected = '<p attr="lorem" class="class" id="id">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should support attributes inside " {attr="lorem ipsum"}', function () {
    var src = 'some text {attr="lorem ipsum"}';
    var expected = '<p attr="lorem ipsum">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add classes in same class attribute {.c1 .c2} -> class="c1 c2"', function () {
    var src = 'some text {.c1 .c2}';
    var expected = '<p class="c1 c2">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should support empty inline tokens', function(){
    var src = ' 1 | 2 \n --|-- \n a | ';
    md.render(src);  // should not crash / throw error
  });

  it('should add classes to inline elements', function(){
    var src = 'paragraph **bold**{.red} asdf';
    var expected = '<p>paragraph <strong class="red">bold</strong> asdf</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });
});
