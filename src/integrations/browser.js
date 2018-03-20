import BaseConverter from '../base-converter';
import parser from '../parser/browser';

/**
 * PreactHTMLConverter class that uses the DOMParser to parse html.
 *
 * @export
 * @class PreactHTMLConverter
 * @extends {BaseConverter}
 */
export default class PreactHTMLConverter extends BaseConverter {
	/**
	 * Creates an instance of PreactHTMLConverter.
	 *
	 * @memberof PreactHTMLConverter
	 */
	constructor() {
		super(parser);
	}

	/**
	 * Calls parent method with DOMParser as parser.
	 *
	 * @static
	 * @param {string} htmlString
	 * @returns {Array}
	 * @memberof PreactHTMLConverter
	 */
	static convertStatic(htmlString) {
		return super.convertStatic(htmlString, parser);
	}
}
