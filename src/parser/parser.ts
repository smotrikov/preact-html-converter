import { DefaultTreeDocumentFragment } from "parse5";

export type Fragment = HTMLElement | DefaultTreeDocumentFragment;

export interface Parser {
    parseFragment: (htmlString: string) => Fragment;
    serialize: (element: Fragment) => string;
}