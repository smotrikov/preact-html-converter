import jsdom from 'jsdom';
const { JSDOM } = jsdom;

global.DOMParser = class DOMParserMock {
	parseFromString(html) {
		const dom = new JSDOM(html);
		return dom.window.document;
	}
}

import Preact, { h } from 'preact';
import render from 'preact-render-to-string';
import { PreactHTMLConverter, convertStatic } from '../src/integrations/browser';

class Test extends Preact.Component {
	render() {
		return <div>{this.props.text}</div>;
	}
}

const renderTest = (vNode, expectedHTML) => {
	expect(render(vNode)).toBe(expectedHTML);
};

describe('main:browser', () => {
	it('should return a single vNode element rendering a provided HTML', () => {
		const converter = PreactHTMLConverter();
		const html = '<div id="root"> <ul> <li>item-1</li> <li>item-2</li> <li>item-3</li> <li>item-4</li> <li>item-5</li> </ul> </div>';

		renderTest(converter.convert(html), html);
	});

	it('should return an array of vNode elements if serveral sibling nodes are provided', () => {
		const converter = PreactHTMLConverter();
		const elements = converter.convert('<li>item-1</li><li>item-2</li><li>item-3</li><li>item-4</li><li>item-5</li>');

		expect(elements.length).toBe(5);
		renderTest(elements[0], '<li>item-1</li>');
		renderTest(elements[2], '<li>item-3</li>');
	});

	it('should parse Preact component', () => {
		const converter = PreactHTMLConverter();
		converter.registerComponent('test', Test);

		const element = converter.convert('<Test text="hello world" />');

		renderTest(element, '<div>hello world</div>');
	});

	it('should parse as static html', () => {
		const html = '<ul class="list"><li>Text1</li><li>Text2</li></ul>';

		renderTest(convertStatic(html), html);
	});

	it('should parse as static html with multiple siblings', () => {
		const html = '<ul class="list"><li>Text1</li><li>Text2</li></ul><div>Sibling</div>';

		renderTest(convertStatic(html), `<div>${html}</div>`);
	});

	it('should parse styles', () => {
		const converter = PreactHTMLConverter();
		const html = '<div style="background-color: #fff;"></div>';
		const resultHtml = '<div style="background-color:  #fff;"></div>';

		renderTest(converter.convert(html), resultHtml);
	});

	it('should parse comment as undefined', () => {
		const converter = PreactHTMLConverter();

		expect(converter.convert('<!-- comment -->')).toBeFalsy();
	});

	it('should return text as is', () => {
		const converter = PreactHTMLConverter();
		const text = 'i am pure text';

		expect(converter.convert(text)).toBe(text);
	});
});
