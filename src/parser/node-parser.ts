import { parseFragment, serialize, DefaultTreeElement, DefaultTreeDocumentFragment } from "parse5";

export interface NodeParser {
    parseFragment: (htmlString: string) => DefaultTreeDocumentFragment;
    serialize: (element: DefaultTreeElement) => string;
}

export const parser: NodeParser = {
    parseFragment: (htmlString: string) => {
        return parseFragment(htmlString) as DefaultTreeDocumentFragment;
    },

    serialize: (element: DefaultTreeElement): string => {
        return serialize(element);
    }
};