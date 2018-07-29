import { ComponentConstructor, VNode } from "preact";
import { parser } from "../parser/browser-parser";
import { BaseConverter, baseConvertStatic} from "../converter/browser-converter";

export const PreactHTMLConverter = () => BaseConverter(parser);
export const convertStatic = (htmlString: string) => baseConvertStatic(htmlString, parser);