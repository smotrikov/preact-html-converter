"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
var parse5_1 = require("parse5");
exports.parser = {
    parseFragment: function (htmlString) {
        return parse5_1.parseFragment(htmlString);
    },
    serialize: function (element) {
        return parse5_1.serialize(element);
    }
};
