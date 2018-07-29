import { ComponentConstructor, VNode } from "preact";
import { NodeParser } from "../parser/node-parser";
export declare function BaseConverter(parser: NodeParser): {
    convert(htmlString: string): (string | VNode<any>)[];
    registerComponent(name: string, component: ComponentConstructor<{}, {}>): void;
};
export declare function baseConvertStatic(htmlString: string, parser: NodeParser): VNode<any>;
