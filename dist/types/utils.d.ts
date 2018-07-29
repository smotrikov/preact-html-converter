export declare type ExclusiveKeys<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
export declare type MergedProperties<T, U> = {
    [K in keyof T & keyof U]: U[K];
};
export declare const assign: <T extends object, U extends object>(target: T, source: U) => Pick<T, Exclude<keyof T, keyof U>> & Pick<U, Exclude<keyof U, keyof T>> & MergedProperties<T, U>;
export declare enum NodeType {
    Text = "#text",
    Comment = "#comment"
}
export declare const convertStylesToObject: (styles: string) => Object;
