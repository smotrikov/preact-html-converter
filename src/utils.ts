export type ExclusiveKeys<T, U> = Pick<T, Exclude<keyof T, keyof U>>
export type MergedProperties<T, U> = {[K in keyof T & keyof U]: U[K]}

export enum NodeType {
    Text = '#text',
    Comment = '#comment',
}

interface StylesObject {
    [key: string]: string
}

export const convertStylesToObject = (styles: string): Object => {
    return styles
        .split(";")
        .reduce((obj: StylesObject, styleDeclaration: string) => {
            if (styleDeclaration) {
                const parts = styleDeclaration.split(":");
                const key = parts[0].trim();
                const keyCharacters = key.split("");

                for (let i = 0; i < keyCharacters.length; i++) {
                    if (keyCharacters[i] === "-") {
                        keyCharacters[i + 1] = keyCharacters[i + 1].toUpperCase();
                        keyCharacters[i] = null;
                    }
                }

                obj[keyCharacters.join("")] = parts[1];
            }

            return obj;
        }, {});
};

export const trimHTMLString = (html: string) => {
    html = html.replace(/\n|\t|\r|\0/g, "");

    return html;
};

export const assign = <T extends object, U extends object>(target: T, source: U) => ({
    ...(target as object),
    ...(source as object)
} as ExclusiveKeys<T, U> & ExclusiveKeys<U, T> & MergedProperties<T, U>);
