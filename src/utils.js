import { h } from 'preact';

const NODE_TYPE_TEXT = '#text';
const NODE_TYPE_COMMENT = '#comment';

/**
 * Lightweight Object.assign implementation
 * 
 * @param {Object} obj 
 * @param {Object} props 
 */
export function assign(obj, props) {
	for (let i in props) obj[i] = props[i];
	return obj;
}

/**
 * Returns an array of a node's child nodes.
 *
 * @export
 * @param {Node} rootNode
 * @param {Map} registeredComponents
 * @returns {Array}
 */
export function traverseNodeTree(rootNode, registeredComponents) {
	const nodeTree = [];

	for (let i = 0; i < rootNode.childNodes.length; i++) {
		nodeTree.push(convertNode(rootNode.childNodes[i], i, registeredComponents));
	}

	return (nodeTree.length === 1) ? nodeTree[0] : nodeTree;
}

/**
 * Converts a node.
 * If the node is of either type text or comment, the value will be returned.
 * Otherwise the node will be converted to a Preact element or component.
 *
 * @export
 * @param {Node} node
 * @param {number} key
 * @param {Map} registeredComponents
 * @returns {string|Object}
 */
export function convertNode(node, key, registeredComponents) {
	if (node.nodeName === NODE_TYPE_TEXT || node.nodeName === NODE_TYPE_COMMENT) {
		return node.value || node.nodeValue;
	}

	const component = registeredComponents.get(node.nodeName.toLowerCase());
	const attributes = convertAttributes(node.attrs || node.attributes, key);
	const tagName = component ? component : node.tagName.toLowerCase();

	if (node.childNodes.length === 0) {
		return h(tagName, attributes);
	}

	const children = [];

	for (let i = 0; i < node.childNodes.length; i++) {
		children.push(convertNode(node.childNodes[i], i, registeredComponents));
	}

	return h(tagName, attributes, children);
}

/**
 * Convert the node's attributes to their Preact counterpart.
 *
 * @export
 * @param {Array} attrs
 * @param {number} key
 * @returns {Object}
 */
export function convertAttributes(attrs, key) {
	const attributes = { key };

	if (!attrs) return attributes;

	for (let i = 0; i < attrs.length; i++) {
		attributes[attrs[i].name] = (attrs[i].name === 'style') ? convertStylesToObject(attrs[i].value) : attrs[i].value;
	}

	return attributes;
}

/**
 * Convert inline styles to the Preact version.
 *
 * @export
 * @param {string} styleString
 * @returns {Object}
 */
export function convertStylesToObject(styleString) {
	const styles = styleString.split(';').reduce((obj, styleDeclaration) => {
		if (styleDeclaration) {
			const parts = styleDeclaration.split(':');
			const key = parts[0].trim();
			const keyCharacters = key.split('');

			for (let index = 0; index < keyCharacters; index++) {
				if (keyCharacters[index] === '-') {
					keyCharacters[index + 1] = keyCharacters[index + 1].toUpperCase();
					keyCharacters[index] = null;
				}
			}

			obj[keyCharacters.join('')] = parts[1];
		}

		return obj;
	}, {});

	return styles;
}

