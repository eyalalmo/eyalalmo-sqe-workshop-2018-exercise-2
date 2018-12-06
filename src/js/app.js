import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {makeTableHTML} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        $('#res').append(makeTableHTML(parsedCode));
    });
});
