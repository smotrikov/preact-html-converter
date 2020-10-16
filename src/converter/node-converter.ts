import { Attribute, DefaultTreeElement, DefaultTreeNode, DefaultTreeTextNode, DefaultTreeDocumentFragment } from "parse5";
import { ComponentConstructor, h, VNode } from "preact";
import { NodeParser } from "../parser/node-parser";
import { assign, NodeType, convertStylesToObject, trimHTMLString } from "../utils";

interface MapEntry  {
	component: ComponentConstructor,
	props?: object
}

const convertAttributes = (attributes: Attribute[], key: number): Object => {
    const convAttrs: {[key: string]: Object} = {
        key: key.toString()
    };

    if (!attributes) return convAttrs;

    for (let i = 0; i < attributes.length; i++) {
        convAttrs[attributes[i].name] = (attributes[i].name === "style") ? convertStylesToObject(attributes[i].value) : attributes[i].value;
    }

    return convAttrs;
};

const convertElement = (element: DefaultTreeElement, key: number, registeredComponents: Map<string, MapEntry>): VNode => {
	const entry = registeredComponents.get(element.nodeName.toLowerCase());
	const attributes = convertAttributes(element.attrs, key);
	const tagName = element.tagName.toLowerCase();

	const props = {
		...attributes,
		...(entry ? entry.props : {})
	} as Object;

	if (element.childNodes.length === 0) {
		return entry ? h(entry.component, props) : h(tagName, props);
	}

	const children = new Array<string|VNode>();

	for (let i = 0; i < element.childNodes.length; i++) {
		children.push(convertNode(element.childNodes[i], i, registeredComponents));
	}

	return entry ? h(entry.component, props, children) : h(tagName, props, children);
};

const convertNode = (node: DefaultTreeNode, key: number, registeredComponents: Map<string, MapEntry>): string|VNode => {
    if (isTextNode(node) && node.value.trim() !== "") {
        return node.value;
    }

    if (isElement(node)) {
        return convertElement(node, key, registeredComponents);
    }

    return null;
};

const traverseNodeTree = (rootNode: DefaultTreeDocumentFragment, registeredComponents: Map<string, MapEntry>): Array<string|VNode> => {
    const nodeTree = new Array<string|VNode>();

    for (let i = 0; i < rootNode.childNodes.length; i++) {
        nodeTree.push(convertNode(rootNode.childNodes[i], i, registeredComponents));
    }

    return nodeTree;
};

const isTextNode = (node: DefaultTreeNode): node is DefaultTreeTextNode => {
    return node.nodeName === NodeType.Text && (<DefaultTreeTextNode>node).value !== undefined;
};

const isElement = (node: DefaultTreeNode): node is DefaultTreeElement => {
    return (<DefaultTreeElement>node).attrs !== undefined;
};

export function BaseConverter(parser: NodeParser) {
    const registeredComponents = new Map<string, MapEntry>();

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

        registerComponent(name: string, component: ComponentConstructor,props:object = {}) {
            registeredComponents.set(name.toLowerCase(), {
            	component: component,
				props: props
            });
        }
    };
};

export function baseConvertStatic(htmlString: string, parser: NodeParser) {
    if (typeof htmlString !== "string") {
        return null;
    }

    htmlString = trimHTMLString(htmlString);

    const fragment = parser.parseFragment(htmlString);

    if (fragment.childNodes.length > 0) {
        let rootElement;

        if (fragment.childNodes.length === 1) {
            const element = fragment.childNodes[0] as DefaultTreeElement;

            rootElement = h(element.nodeName.toLowerCase(), assign({
                dangerouslySetInnerHTML: {
                    __html: parser.serialize(element)
                }
            }, convertAttributes(element.attrs, 0)));
        } else {
            rootElement = h("div", { dangerouslySetInnerHTML: { __html: htmlString } });
        }

        return rootElement;
    }

    return null;
};
