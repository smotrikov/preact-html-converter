# preact-html-converter [![Build Status](https://travis-ci.org/Sethorax/preact-html-converter.svg?branch=master)](https://travis-ci.org/Sethorax/preact-html-converter) [![npm version](https://badge.fury.io/js/preact-html-converter.svg)](https://badge.fury.io/js/preact-html-converter)

This module converts a raw HTML string to a Preact element or an array of Preact elements. Component rendering is also supported.  

> Want to use this module with react? Checkout the react version - [react-html-converter](https://github.com/Sethorax/react-html-converter)

## Installation

Install via **npm**:  
`npm install --save preact-html-converter`

or **yarn**:  
`yarn add preact-html-converter`

## General Info

This module ships with two integrations. One for node and one for the browser.  

> The browser version only depends on `preact` and is just **862 Bytes** in filesize!

The main reason behind having to versions is that altough the node version also works in the browser, the usage of `parse5` does add a lot to the overall bundle filesize. Therefore the browser version uses the native `DOMParser` instead of `parse5` to handle the html string parsing.

Module usage is the same for node and for the browser.

If you use this module in node.js just import the node integration:  

```js
import PreactHTMLConverter from 'preact-html-converter/node'
```

If you use it in the browser import the browser integration:  

```js
import PreactHTMLConverter from 'preact-html-converter/browser'
```

## Example

```js
import Preact from 'preact';
import PreactHTMLConverter from 'preact-html-converter/node';

class Test extends Preact.Component {
    render() (
        return <div>{this.props.text}</div>;
    );
}

const converter = PreactHTMLConverter();
converter.registerComponent('test', Test);

const html = '<div class="my-div"><Test text="Hello World" /></div>';

class App extends Preact.Component {
    render() {
        return (
            <div class="my-app">
                {converter.convert(html)}
            </div>
        );
    }
}
```

As shown in the above example the PreactHTMLConverter just takes a simple HTML string as an argument and returns a Preact element or an array of Preact elements. Those elements can then be easily used in other Preact components.

The PreactHTMLConverter is also able to create Preact components from the HTML string. To make this work all components must be registered in the converter before converting the HTML string. Just pass in the name of the component's tag and the component itself and the converter will convert those components if they appear in the HTML string.

Please note that any sibling nodes of a Preact component will not be rendered! Make sure to wrap the component with a div element.

### Static rendering
If you just want to quickly render a html string, you can import the `convertStatic` function of this module. With this function only the root node will be converted to a React element. All child nodes will be rendered with `dangerouslySetInnerHTML`.

## License

[MIT](LICENSE)
