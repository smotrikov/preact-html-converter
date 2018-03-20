import BaseConverter from '../base-converter';
import parser from '../parser/node';

/**
 * PreactHTMLConverter class that uses parse5 to parse html.
 *
 * @export
 * @class PreactHTMLConverter
 * @extends {BaseConverter}
 */
export default class PreactHTMLConverter extends BaseConverter {
	/**
	 * Creates an instance of PreactHTMLConverter with parse5 as parser.
	 * @memberof PreactHTMLConverter
	 */
	constructor() {
		super(parser);
	}

	/**
	 * Calls parent method with parse5 as parser.
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
