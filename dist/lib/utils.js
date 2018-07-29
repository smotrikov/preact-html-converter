"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assign = function (target, source) { return (__assign({}, target, source)); };
var NodeType;
(function (NodeType) {
    NodeType["Text"] = "#text";
    NodeType["Comment"] = "#comment";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
exports.convertStylesToObject = function (styles) {
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
