import { BaseConverter, baseConvertStatic } from '../base-converter';
import parser from '../parser/browser';

export const PreactHTMLConverter = () => BaseConverter(parser);
export const convertStatic = htmlString => baseConvertStatic(htmlString, parser);
