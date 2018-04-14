/* global Map */

import { h } from 'preact';
import { traverseNodeTree, convertAttributes, assign } from './utils';

export function BaseConverter(parser) {
	const registeredComponents = new Map();

	return {
		/**
		 * Convert a html string to Preact elements or components.
		 *
		 * @param {String} htmlString
		 * @returns {Array|null}
		 */
		convert: htmlString => {
			if (typeof htmlString !== 'string') {
				return null;
			}

			const html = parser.parseFragment(htmlString);

			if (html.childNodes.length > 0) {
				return traverseNodeTree(html, registeredComponents);
			}

			return null;
		},

		/**
		 * Register a Preact component.
		 *
		 * @param {String} name
		 * @param {React.Component} componentClass
		 */
		registerComponent: (name, componentClass) => {
			registeredComponents.set(name.toLowerCase(), componentClass);
		}
	}
}

	/**
	 * Parse the html string with the specified parser.
	 * If the html string has only one root node, the root node
	 * will be converted to a Preact element. The child nodes will
	 * be addes as innerHTML.
	 *
	 * If more than one root nodes are present, the root nodes will
	 * be added as child nodes to a div element.
	 *
	 * Please note that Preact is not aware of the child nodes.
	 * If you need Preact to be aware of the child nodes, you probably
	 * want to use the non-static convert method.
	 *
	 * @static
	 * @param {string} htmlString
	 * @param {Object} parser
	 * @returns {vNode|null}
	 */
	export function baseConvertStatic(htmlString, parser) {
		if (typeof htmlString !== 'string') {
			return null;
		}

		const html = parser.parseFragment(htmlString);

		if (html.childNodes.length > 0) {
			let rootNode;

			if (html.childNodes.length === 1) {
				const node = html.childNodes[0];
				rootNode = h(node.nodeName.toLowerCase(), assign({
					dangerouslySetInnerHTML: {
						__html: parser.serialize(node)
					}
				}, convertAttributes(node.attrs || node.attributes, 0)));
			} else {
				rootNode = h('div', { dangerouslySetInnerHTML: { __html: htmlString } });
			}

			return rootNode;
		}

		return null;
	}
