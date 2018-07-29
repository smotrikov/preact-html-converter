import { DefaultTreeElement, DefaultTreeDocumentFragment } from "parse5";
export interface NodeParser {
    parseFragment: (htmlString: string) => DefaultTreeDocumentFragment;
    serialize: (element: DefaultTreeElement) => string;
}
export declare const parser: NodeParser;
