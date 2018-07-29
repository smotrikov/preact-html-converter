export interface BrowserParser {
    parseFragment: (htmlString: string) => HTMLElement;
    serialize: (element: Element) => string;
}
export declare const parser: BrowserParser;
