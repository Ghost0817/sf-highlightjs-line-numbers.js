// jshint multistr:true

(function (w, d) {
    'use strict';

    var TABLE_NAME = 'hljs-ln',
        LINE_NAME = 'hljs-ln-line',
        CODE_BLOCK_NAME = 'hljs-ln-code',
        NUMBERS_BLOCK_NAME = 'linenos',
        NUMBER_LINE_NAME = 'hljs-ln-n',
        DATA_ATTR_NAME = 'data-line-number',
        BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

    if (w.hljs) {
        w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
        w.hljs.lineNumbersBlock = lineNumbersBlock;

        addStyles();
    } else {
        w.console.error('highlight.js not detected!');
    }

    function addStyles () {
        var css = d.createElement('style');
        css.type = 'text/css';
        css.innerHTML = format(
            '.{0}{border-collapse:collapse}\
            .{0} td{padding:0}\
            .{1}:before{content:attr({2})}',
        [
            TABLE_NAME,
            NUMBER_LINE_NAME,
            DATA_ATTR_NAME
        ]);
        d.getElementsByTagName('head')[0].appendChild(css);
    }

    function initLineNumbersOnLoad (options) {
        if (d.readyState === 'complete') {
            documentReady(options);
        } else {
            w.addEventListener('DOMContentLoaded', function () {
                documentReady(options);
            });
        }
    }

    function documentReady (options) {
        try {
            var blocks = d.querySelectorAll('code.hljs');
            for (var i in blocks) {
                if (blocks.hasOwnProperty(i)) {
                    lineNumbersBlock(blocks[i], options);
                }
            }
        } catch (e) {
            w.console.error('LineNumbers error: ', e);
        }
    }

    function lineNumbersBlock (element, options) {
        if (typeof element !== 'object') return;

        // define options or set default
        options = options || {
            singleLine: false
        };

        // convert options
        var firstLineIndex = !!options.singleLine ? 0 : 1;

        async(function () {

            duplicateMultilineNodes(element);
			
			var numbers = addLineNumbersBlockFor(element.innerHTML, firstLineIndex)

			element.parentNode.parentNode.parentNode.parentNode.appendChild(numbers);

			element.parentNode.parentNode.parentNode.parentNode.insertBefore(numbers, element.parentNode.parentNode.parentNode.parentNode.firstChild);

        });
    }

    function addLineNumbersBlockFor (inputHtml, firstLineIndex) {

        var lines = getLines(inputHtml);
			
		var result = document.createElement( "td" );
		result.className = "linenos";

        // if last line contains only carriage return remove it
        if (lines[lines.length-1].trim() === '') {
            lines.pop();
        }
		
        if (lines.length > firstLineIndex) {
            var html = '';

            for (var i = 0, l = lines.length; i < l; i++) {
				if(l === (i + 1 )){
					html += format(
						'{0}',
					[
						i + 1
					]);
				} else {
					html += format(
						'{0}\r',
					[
						i + 1
					]);
				}
            }
			result.innerHTML = format("<div class='linenodiv'><pre>{0}</pre></div>", [ html ]);
        }

        return result;
    }

    /**
     * Recursive method for fix multi-line elements implementation in highlight.js
     * Doing deep passage on child nodes.
     * @param {HTMLElement} element
     */
    function duplicateMultilineNodes (element) {
        var nodes = element.childNodes;
        for (var node in nodes) {
            if (nodes.hasOwnProperty(node)) {
                var child = nodes[node];
                if (getLinesCount(child.textContent) > 0) {
                    if (child.childNodes.length > 0) {
                        duplicateMultilineNodes(child);
                    } else {
                        duplicateMultilineNode(child.parentNode);
                    }
                }
            }
        }
    }

    /**
     * Method for fix multi-line elements implementation in highlight.js
     * @param {HTMLElement} element
     */
    function duplicateMultilineNode (element) {
        var className = element.className;

        if ( ! /hljs-/.test(className)) return;

        var lines = getLines(element.innerHTML);

        for (var i = 0, result = ''; i < lines.length; i++) {
            result += format('<span class="{0}">{1}</span>\n', [ className, lines[i] ]);
        }

        element.innerHTML = result.trim();
    }

    function getLines (text) {
        if (text.length === 0) return [];
        return text.split(BREAK_LINE_REGEXP);
    }

    function getLinesCount (text) {
        return (text.trim().match(BREAK_LINE_REGEXP) || []).length;
    }

    function async (func) {
        w.setTimeout(func, 0);
    }

    /**
     * {@link https://wcoder.github.io/notes/string-format-for-string-formating-in-javascript}
     * @param {string} format
     * @param {array} args
     */
    function format (format, args) {
        return format.replace(/\{(\d+)\}/g, function(m, n){
            return args[n] ? args[n] : m;
        });
    }

}(window, document));