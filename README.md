# sf-highlightjs-line-numbers.js
Line numbering plugin for Highlight.js


## Usage

Download plugin and include file after highlight.js:
```html
<script src="path/to/highlight.min.js"></script>

<script src="path/to/highlightjs-line-numbers.min.js"></script>
```

Initialize plugin after highlight.js:
```js
hljs.initHighlightingOnLoad();

hljs.initLineNumbersOnLoad();
```

Here’s an equivalent way to calling `initLineNumbersOnLoad` using jQuery:
```js
$(document).ready(function() {
    $('code.hljs').each(function(i, block) {
        hljs.lineNumbersBlock(block);
    });
});
```


If your needs cool style, add styles by taste:
```css
td.linenos {
  background-color: #1e2125;
  border: 0;
  border-right: 1px solid #222;
  padding: 15px 5px;
  text-align: right;
  vertical-align: top;
  width: 35px;
}
```

## Options

After version 1.0 plugin has optional parameter `options` - for custom setup.

name       | type    | default value | description
-----------|---------|---------------|-----------------------
singleLine | boolean | false         | enable plugin for code block with one line

#### Examples of using

```js
hljs.initLineNumbersOnLoad({
    singleLine: true
});
```

```js
hljs.lineNumbersBlock(myCodeBlock, myOptions);
```

---
&copy; 2018 Sainzaya Batkhuu | MIT License
