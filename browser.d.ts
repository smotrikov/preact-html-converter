import { VNode, ComponentConstructor } from "preact";

interface BaseConverter {
    convert: (htmlString: string) => Array<VNode>|null;
    registerComponent: (name: string, componentClass: ComponentConstructor) => void;
}

export function PreactHTMLConverter(): BaseConverter;
export function convertStatic(htmlString: string): VNode|null;