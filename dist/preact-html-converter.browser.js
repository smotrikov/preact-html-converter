(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('preact')) :
    typeof define === 'function' && define.amd ? define(['exports', 'preact'], factory) :
    (factory((global.preactHtmlConverter = {}),global.preact));
}(this, (function (exports,preact) { 'use strict';

    var parser = {
        parseFragment: function (htmlString) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(htmlString, "text/html");
            return doc.body;
        },
        serialize: function (element) {
            return element.innerHTML;
        }
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var NodeType;
    (function (NodeType) {
        NodeType["Text"] = "#text";
        NodeType["Comment"] = "#comment";
    })(NodeType || (NodeType = {}));
    var convertStylesToObject = function (styles) {
        return styles
            .split(";")
            .reduce(function (obj, styleDeclaration) {
            if (styleDeclaration) {
                var parts = styleDeclaration.split(":");
                var key = parts[0].trim();
                var keyCharacters = key.split("");
                for (var i = 0; i < keyCharacters.length; i++) {
                    if (keyCharacters[i] === "-") {
                        keyCharacters[i + 1] = keyCharacters[i + 1].toUpperCase();
                        keyCharacters[i] = null;
                    }
                }
                obj[keyCharacters.join("")] = parts[1];
            }
            return obj;
        }, {});
    };
    var trimHTMLString = function (html) {
        html = html.replace(/\n|\t|\r|\0/g, "");
        return html;
    };
    var assign = function (target, source) { return (__assign({}, target, source)); };

    var convertAttributes = function (attributes, key) {
        var convAttrs = {
            key: key.toString()
        };
        if (!attributes)
            return convAttrs;
        for (var i = 0; i < attributes.length; i++) {
            convAttrs[attributes[i].name] = (attributes[i].name === "style") ? convertStylesToObject(attributes[i].value) : attributes[i].value;
        }
        return convAttrs;
    };
    var convertElement = function (element, key, registeredComponents) {
        var component = registeredComponents.get(element.nodeName.toLowerCase());
        var attributes = convertAttributes(element.attributes, key);
        var tagName = element.tagName.toLowerCase();
        if (element.childNodes.length === 0) {
            return component ? preact.h(component, attributes) : preact.h(tagName, attributes);
        }
        var children = new Array();
        for (var i = 0; i < element.childNodes.length; i++) {
            children.push(convertNode(element.childNodes[i], i, registeredComponents));
        }
        return component ? preact.h(component, attributes, children) : preact.h(tagName, attributes, children);
    };
    var convertNode = function (node, key, registeredComponents) {
        if (node.nodeName === NodeType.Text && node.nodeValue.trim() !== "") {
            return node.nodeValue;
        }
        if (isElement(node)) {
            return convertElement(node, key, registeredComponents);
        }
        return null;
    };
    var traverseNodeTree = function (rootNode, registeredComponents) {
        var nodeTree = new Array();
        for (var i = 0; i < rootNode.childNodes.length; i++) {
            nodeTree.push(convertNode(rootNode.childNodes[i], i, registeredComponents));
        }
        return nodeTree;
    };
    var isElement = function (node) {
        return node.attributes !== undefined;
    };
    function BaseConverter(parser) {
        var registeredComponents = new Map();
        return {
            convert: function (htmlString) {
                if (typeof htmlString !== "string") {
                    return null;
                }
                htmlString = trimHTMLString(htmlString);
                var fragment = parser.parseFragment(htmlString);
                if (fragment.childNodes.length > 0) {
                    return traverseNodeTree(fragment, registeredComponents).filter(function (value) {
                        return value ? true : false;
                    });
                }
                return null;
            },
            registerComponent: function (name, component) {
                registeredComponents.set(name.toLowerCase(), component);
            }
        };
    }
    function baseConvertStatic(htmlString, parser) {
        if (typeof htmlString !== "string") {
            return null;
        }
        htmlString = trimHTMLString(htmlString);
        var fragment = parser.parseFragment(htmlString);
        if (fragment.childNodes.length > 0) {
            var rootElement = void 0;
            if (fragment.childNodes.length === 1) {
                var element = fragment.childNodes[0];
                if (isElement(element)) {
                    rootElement = preact.h(element.nodeName.toLowerCase(), assign({
                        dangerouslySetInnerHTML: {
                            __html: parser.serialize(element)
                        }
                    }, convertAttributes(element.attributes, 0)));
                }
            }
            else {
                rootElement = preact.h("div", { dangerouslySetInnerHTML: { __html: htmlString } });
            }
            return rootElement;
        }
        return null;
    }

    var PreactHTMLConverter = function () { return BaseConverter(parser); };
    var convertStatic = function (htmlString) { return baseConvertStatic(htmlString, parser); };

    exports.PreactHTMLConverter = PreactHTMLConverter;
    exports.convertStatic = convertStatic;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
