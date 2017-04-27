'use strict'

var helperVars = require('./variables');
var helperString = require('./string');
var interpreter = require('../expressions/interpreter');
var context = require('../context');

var common = {
    /**
     * Process expressions and vars in a text with walnut marks '${text}'
     */
    getTreatedValue: function (text) {
        var content = helperString.removeQuotationMark(text);

        var list = text.match(/\${(.*?)}/g);
        if (list === null) {
            return content;
        }

        for (var i = 0; i < list.length; i++) {
            var word = list[i];
            var newWord = word;

            //get only text content
            while (helperString.hasBracketsMark(newWord) || helperString.hasQuotationMark(newWord)) {
                newWord = helperString.removeBracketsMark(newWord);
                newWord = helperString.removeQuotationMark(newWord);
            }

            //parse vars
            newWord = helperVars.nutParseVars(newWord);

            //solve expressions
            newWord = interpreter.resolveExpression(newWord);

            //replacement
            content = content.replace(word, newWord);
        }

        return content;
    },

    compare: function (current, type, received) {

        var comparisson = { result: null, msg: null };
        type = type.trim().toLowerCase().replace(/\s/gi, '');

        switch (type) {
            case 'whichcontains':
                comparisson.result = current.includes(received);
                comparisson.msg = helperString.formatString('Current value [{0}] not contains [{1}]', [current, received]);
                break;

            case 'whichnotcontains':
                comparisson.result = !current.includes(received);
                comparisson.msg = helperString.formatString('Current value [{0}] contains [{1}]', [current, received]);
                break;

            case 'equalsto':
                comparisson.result = current === received;
                comparisson.msg = helperString.formatString('Current value [{0}] not equals to [{1}]', [current, received]);
                break;

            case 'notequalsto':
                comparisson.result = current !== received;
                comparisson.msg = helperString.formatString('Current value [{0}] is equals to [{1}]', [current, received]);
                break;

            default:
                break;
        }

        if (comparisson.result) comparisson.msg = '';

        return comparisson;
    }

};

module.exports = common;