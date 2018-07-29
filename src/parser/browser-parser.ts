export interface BrowserParser {
    parseFragment: (htmlString: string) => HTMLElement;
    serialize: (element: Element) => string;
}

export const parser: BrowserParser = {
    parseFragment: (htmlString: string): HTMLElement => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        return doc.body;
    },

    serialize: (element: Element): string => {
        return element.innerHTML;
    }
};