"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseConvertStatic = exports.BaseConverter = void 0;
var preact_1 = require("preact");
var utils_1 = require("../utils");
var convertAttributes = function (attributes, key) {
    var convAttrs = {
        key: key.toString()
    };
    if (!attributes)
        return convAttrs;
    for (var i = 0; i < attributes.length; i++) {
        convAttrs[attributes[i].name] = (attributes[i].name === "style") ? utils_1.convertStylesToObject(attributes[i].value) : attributes[i].value;
    }
    return convAttrs;
};
var convertElement = function (element, key, registeredComponents) {
    var entry = registeredComponents.get(element.nodeName.toLowerCase());
    var attributes = convertAttributes(element.attributes, key);
    var tagName = element.tagName.toLowerCase();
    var props = __assign(__assign({}, attributes), (entry ? entry.props : {}));
    if (element.childNodes.length === 0) {
        return entry ? preact_1.h(entry.component, props) : preact_1.h(tagName, props);
    }
    var children = new Array();
    for (var i = 0; i < element.childNodes.length; i++) {
        children.push(convertNode(element.childNodes[i], i, registeredComponents));
    }
    return entry ? preact_1.h(entry.component, props, children) : preact_1.h(tagName, props, children);
};
var convertNode = function (node, key, registeredComponents) {
    if (node.nodeName === utils_1.NodeType.Text && node.nodeValue.trim() !== "") {
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
            htmlString = utils_1.trimHTMLString(htmlString);
            var fragment = parser.parseFragment(htmlString);
            if (fragment.childNodes.length > 0) {
                return traverseNodeTree(fragment, registeredComponents).filter(function (value) {
                    return !!value;
                });
            }
            return null;
        },
        registerComponent: function (name, component, props) {
            if (props === void 0) { props = {}; }
            registeredComponents.set(name.toLowerCase(), {
                component: component,
                props: props
            });
        }
    };
}
exports.BaseConverter = BaseConverter;
;
function baseConvertStatic(htmlString, parser) {
    if (typeof htmlString !== "string") {
        return null;
    }
    htmlString = utils_1.trimHTMLString(htmlString);
    var fragment = parser.parseFragment(htmlString);
    if (fragment.childNodes.length > 0) {
        var rootElement = void 0;
        if (fragment.childNodes.length === 1) {
            var element = fragment.childNodes[0];
            if (isElement(element)) {
                rootElement = preact_1.h(element.nodeName.toLowerCase(), utils_1.assign({
                    dangerouslySetInnerHTML: {
                        __html: parser.serialize(element)
                    }
                }, convertAttributes(element.attributes, 0)));
            }
        }
        else {
            rootElement = preact_1.h("div", { dangerouslySetInnerHTML: { __html: htmlString } });
        }
        return rootElement;
    }
    return null;
}
exports.baseConvertStatic = baseConvertStatic;
;
