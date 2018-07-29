import { ComponentConstructor, VNode } from "preact";
import { BrowserParser } from "../parser/browser-parser";
export declare function BaseConverter(parser: BrowserParser): {
    convert(htmlString: string): (string | VNode<any>)[];
    registerComponent(name: string, component: ComponentConstructor<{}, {}>): void;
};
export declare function baseConvertStatic(htmlString: string, parser: BrowserParser): VNode<any>;
