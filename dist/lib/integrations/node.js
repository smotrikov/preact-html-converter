"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_parser_1 = require("../parser/node-parser");
var node_converter_1 = require("../converter/node-converter");
exports.PreactHTMLConverter = function () { return node_converter_1.BaseConverter(node_parser_1.parser); };
exports.convertStatic = function (htmlString) { return node_converter_1.baseConvertStatic(htmlString, node_parser_1.parser); };
