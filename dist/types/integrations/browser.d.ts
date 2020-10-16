import { ComponentConstructor, VNode } from "preact";
export declare const PreactHTMLConverter: () => {
    convert(htmlString: string): (string | VNode<any>)[];
    registerComponent(name: string, component: ComponentConstructor<{}, {}>, props?: object): void;
};
export declare const convertStatic: (htmlString: string) => VNode<any>;
