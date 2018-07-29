import { DefaultTreeDocumentFragment } from "parse5";
export declare type Fragment = HTMLElement | DefaultTreeDocumentFragment;
export interface Parser {
    parseFragment: (htmlString: string) => Fragment;
    serialize: (element: Fragment) => string;
}
