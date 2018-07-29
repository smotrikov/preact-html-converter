"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    var component = registeredComponents.get(element.nodeName.toLowerCase());
    var attributes = convertAttributes(element.attributes, key);
    var tagName = element.tagName.toLowerCase();
    if (element.childNodes.length === 0) {
        return component ? preact_1.h(component, attributes) : preact_1.h(tagName, attributes);
    }
    var children = new Array();
    for (var i = 0; i < element.childNodes.length; i++) {
        children.push(convertNode(element.childNodes[i], i, registeredComponents));
    }
    return component ? preact_1.h(component, attributes, children) : preact_1.h(tagName, attributes, children);
};
var convertNode = function (node, key, registeredComponents) {
    if (node.nodeName === utils_1.NodeType.Text) {
        return node.nodeValue;
    }
    if (node.nodeName === utils_1.NodeType.Comment) {
        return null;
    }
    if (isElement(node)) {
        return convertElement(node, key, registeredComponents);
    }
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
            var fragment = parser.parseFragment(htmlString);
            if (fragment.childNodes.length > 0) {
                return traverseNodeTree(fragment, registeredComponents);
            }
            return null;
        },
        registerComponent: function (name, component) {
            registeredComponents.set(name.toLowerCase(), component);
        }
    };
}
exports.BaseConverter = BaseConverter;
;
function baseConvertStatic(htmlString, parser) {
    if (typeof htmlString !== "string") {
        return null;
    }
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
