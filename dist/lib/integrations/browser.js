"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStatic = exports.PreactHTMLConverter = void 0;
var browser_parser_1 = require("../parser/browser-parser");
var browser_converter_1 = require("../converter/browser-converter");
exports.PreactHTMLConverter = function () { return browser_converter_1.BaseConverter(browser_parser_1.parser); };
exports.convertStatic = function (htmlString) { return browser_converter_1.baseConvertStatic(htmlString, browser_parser_1.parser); };
