"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = {
    parseFragment: function (htmlString) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlString, "text/html");
        return doc.body;
    },
    serialize: function (element) {
        return element.innerHTML;
    }
};
