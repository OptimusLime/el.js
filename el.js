/**
* el.js v0.3 - A JavaScript Node Creation Tool
*
* https://github.com/markgandolfo/el.js
*
* Copyright 2013 Mark Gandolfo and other contributors
* Released under the MIT license.
* http://en.wikipedia.org/wiki/MIT_License
*/

module.exports = el;

function el(tagName, attrs, child) {
  // Pattern to match id & class names
  var pattern = /([a-z]+|#[\w-\d]+|\.[\w\d-]+)/g

  if(arguments.length === 2) {
    if(attrs instanceof Array
    || typeof attrs === 'function'
    || typeof attrs === 'string'
    || attrs.constructor !== Object
    ) {
      child = attrs;
      attrs = undefined;
    }

  }
  // does the user pass attributes in, if not set an empty object up
  attrs = typeof attrs !== 'undefined' ? attrs : {};
  child = typeof child !== 'undefined' ? child : [];
  child = child instanceof Array ? child : [child];

  // run the pattern over the tagname an attempt to pull out class & id attributes
  // shift the first record out as it's the element name
  matched = tagName.match(pattern);
  tagName = matched[0];
  matched.shift();

  // Iterate over the matches and concat the attrs to either class or id keys in attrs json object
  for (var m in matched) {
    if(matched[m][0] == '.') {
      if(attrs['class'] == undefined) {
        attrs['class'] = matched[m].substring(1, matched[m].length);
      } else {
        attrs['class'] = attrs['class'] + ' ' + matched[m].substring(1, matched[m].length);
      }
    } else if(matched[m][0] == '#') {
      if(attrs['id'] == undefined) {
        attrs['id'] = matched[m].substring(1, matched[m].length)
      } else {
        // Feels dirty having multiple id's, but it's allowed: http://www.w3.org/TR/selectors/#id-selectors
        attrs['id'] = attrs['id'] + ' ' + matched[m].substring(1, matched[m].length);
      }
    }
  }

  //A little helper: if your attrs includes style object
  //we turn the style object into a style string for direct application
  if(typeof attrs["style"] != "string" && typeof attrs["style"] == "object")
  {
    var styleObj = attrs["style"];
    //we build the string
    var concat = "";

    //for each style object
    for(var key in styleObj) 
      //concat the key + value with : inbetween (e.g. width: 100px;)
      concat += (key + ": " + styleObj + "; ");

    //grab the concatenated style string
    attrs["style"] = concat; 
  }


  // create the element
  var element = document.createElement(tagName);
  for(var i = 0; i < child.length; i += 1) {
    (function(child){
      switch(typeof child) {
        case 'object':
          element.appendChild(child);
          break;
        case 'function':
          var discardDoneCallbackResult = false;
          var doneCallback = function doneCallback(content) {
            if (!discardDoneCallbackResult) {
              element.appendChild(content);
            }
          }
          var result = child.apply(null, [doneCallback])
          if(typeof result != 'undefined') {
            discardDoneCallbackResult = true;
            element.appendChild(result);
          }
          break;
        case 'string':
          element.appendChild(document.createTextNode(child));
        default:
          //???
      }
    }(child[i]));

  }

  for (var key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      element.setAttribute(key, attrs[key]);
    }
  }

  return element;
};

// alias
el.create = el.c = el;

// vanity methods
el.img = function(attrs) {
  return el.create('img', attrs);
};

el.a = function(attrs, child) {
  return el.create('a', attrs, child);
};

el.div = function(attrs, child) {
  return el.create('div', attrs, child);
};

el.p = function(attrs, child) {
  return el.create('p', attrs, child);
};

el.input = function(attrs, child) {
  return el.create('input', attrs);
};
