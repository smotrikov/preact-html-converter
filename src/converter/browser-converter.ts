import { ComponentConstructor, h, VNode } from "preact";
import { BrowserParser } from "../parser/browser-parser";
import { assign, NodeType, convertStylesToObject, trimHTMLString } from "../utils";


const convertAttributes = (attributes: NamedNodeMap, key: number): Object => {
    const convAttrs: {[key: string]: Object} = {
        key: key.toString()
    };

    if (!attributes) return convAttrs;

    for (let i = 0; i < attributes.length; i++) {
        convAttrs[attributes[i].name] = (attributes[i].name === "style") ? convertStylesToObject(attributes[i].value) : attributes[i].value;
    }

    return convAttrs;
};

const convertElement = (element: Element, key: number, registeredComponents: Map<string, ComponentConstructor>): VNode => {
    const component = registeredComponents.get(element.nodeName.toLowerCase());
    const attributes = convertAttributes(element.attributes, key);
    const tagName = element.tagName.toLowerCase();

    if (element.childNodes.length === 0) {
        return component ? h(component, attributes) : h(tagName, attributes);
    }

    const children = new Array<string|VNode>();

    for (let i = 0; i < element.childNodes.length; i++) {
        children.push(convertNode(element.childNodes[i], i, registeredComponents));
    }

    return component ? h(component, attributes, children) : h(tagName, attributes, children);
};

const convertNode = (node: Node, key: number, registeredComponents: Map<string, ComponentConstructor>): string|VNode => {    
    if (node.nodeName === NodeType.Text && node.nodeValue.trim() !== "") {
        return node.nodeValue;
    }

    if (isElement(node)) {
        return convertElement(node, key, registeredComponents);
    }

    return null;
};

const traverseNodeTree = (rootNode: Element, registeredComponents: Map<string, ComponentConstructor>): Array<string|VNode> => {
    const nodeTree = new Array<string|VNode>();

    for (let i = 0; i < rootNode.childNodes.length; i++) {
        nodeTree.push(convertNode(rootNode.childNodes[i], i, registeredComponents));
    }

    return nodeTree;
};

const isElement = (node: Node): node is Element => {
    return (<Element>node).attributes !== undefined;
}

export function BaseConverter(parser: BrowserParser) {
    const registeredComponents = new Map<string, ComponentConstructor>();

    return {
        convert(htmlString: string) {
            if (typeof htmlString !== "string") {
                return null;
            }

            htmlString = trimHTMLString(htmlString);

            const fragment = parser.parseFragment(htmlString);

            if (fragment.childNodes.length > 0) {
                return traverseNodeTree(fragment, registeredComponents).filter(value => {
                    return value ? true : false;
                });
            }

            return null;
        },

        registerComponent(name: string, component: ComponentConstructor) {
            registeredComponents.set(name.toLowerCase(), component);
        }
    };
};

export function baseConvertStatic(htmlString: string, parser: BrowserParser) {
    if (typeof htmlString !== "string") {
        return null;
    }

    htmlString = trimHTMLString(htmlString);

    const fragment = parser.parseFragment(htmlString);

    if (fragment.childNodes.length > 0) {
        let rootElement;

        if (fragment.childNodes.length === 1) {
            const element = fragment.childNodes[0];

            if (isElement(element)) {
                rootElement = h(element.nodeName.toLowerCase(), assign({
                    dangerouslySetInnerHTML: {
                        __html: parser.serialize(element)
                    }
                }, convertAttributes(element.attributes, 0)));
            }
        } else {
            rootElement = h("div", { dangerouslySetInnerHTML: { __html: htmlString } });
        }

        return rootElement;
    }

    return null;
};