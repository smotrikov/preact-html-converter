import { ComponentConstructor, VNode } from "preact";
import { parser } from "../parser/node-parser";
import { BaseConverter, baseConvertStatic} from "../converter/node-converter";

export const PreactHTMLConverter = () => BaseConverter(parser);
export const convertStatic = (htmlString: string) => baseConvertStatic(htmlString, parser);