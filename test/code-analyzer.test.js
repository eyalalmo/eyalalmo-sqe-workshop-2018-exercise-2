import assert from 'assert';
import {makeTable, makeTableHTML, parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('', {loc: true})),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,' +
            '"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });
});

describe('The the make table and the functions it uses', () => {
    it('is parsing a full program (given as an example)', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\nlow = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}'))),
            '[[1,"FunctionDeclaration","binarySearch","",""],[1,"Identifier","X","",""],[1,"Identifier","V","",""],[1,"Identifier","n","",""],[2,"VariableDeclarator","low","",""],[2,"VariableDeclarator","high","",""],[2,"VariableDeclarator","mid","",""],[3,"AssignmentExpression","low","","0"],[4,"AssignmentExpression","high","","n - 1"],[5,"WhileStatement","","low <= high",""],[6,"AssignmentExpression","mid","","(low + high) / 2"],[7,"IfStatement","","X < V[mid]",""],[8,"AssignmentExpression","high","","mid - 1"],[9,"IfStatement","","X > V[mid]",""],[10,"AssignmentExpression","low","","mid + 1"],[12,"ReturnStatement","","","mid"],[14,"ReturnStatement","","","-1"]]');
    });
});

describe('The the make table and the functions it uses', () => {
    it('is parsing a function declaration with a for loop in it', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode('function max(Arr){let max = 0;for(let i=0; i<Arr.length; i++){if(Arr[i]<max) max = Arr[i];}}'))),
            '[[1,"FunctionDeclaration","max","",""],[1,"Identifier","Arr","",""],[1,"VariableDeclarator","max","","0"],[1,"ForStatement","","i < Arr.length",""],[1,"VariableDeclarator","i","","0"],[1,"IfStatement","","Arr[i] < max",""],[1,"AssignmentExpression","max","","Arr[i]"]]'
        );
    });
    it('is parsing two functions declarations', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode('function retX(X,Y){return X;}function retY(X,Y){return Y;}'))),
            '[[1,"FunctionDeclaration","retX","",""],[1,"Identifier","X","",""],[1,"Identifier","Y","",""],[1,"ReturnStatement","","","X"],[1,"FunctionDeclaration","retY","",""],[1,"Identifier","X","",""],[1,"Identifier","Y","",""],[1,"ReturnStatement","","","Y"]]'
        );
    });
    it('is parsing a if statement with no part', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode('if(X = 5)a = 3;'))),
            '[[1,"IfStatement","","X = 5",""],[1,"AssignmentExpression","a","","3"]]');
    });
});

describe('The the make table and the functions it uses', () => {

    it('is parsing a for loop with no part', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode('if(X = 5)a = 3;'))),
            '[[1,"IfStatement","","X = 5",""],[1,"AssignmentExpression","a","","3"]]');
    });

    it('is parsing a while loop with no part', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode('while(a = 5)b = 1;'))),
            '[[1,"WhileStatement","","a = 5",""],[1,"AssignmentExpression","b","","1"]]');
    });

    it('is parsing a for loop with no part', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode('for(let a = 5; a<70; a++)\nf = 3;'))),
            '[[1,"ForStatement","","a < 70",""],[1,"VariableDeclarator","a","","5"],[2,"AssignmentExpression","f","","3"]]');
    });
});

describe('The the make table and the functions it uses', () => {
    it('is parsing a function definition with no variables', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode('function f(){\nreturn 1;\n}'))),
            '[[1,"FunctionDeclaration","f","",""],[2,"ReturnStatement","","","1"]]');
    });

    it('is parsing empty program into an empty list', () => {
        assert.equal(
            JSON.stringify(makeTable(parseCode(''))),
            '[]');
    });

    it('is testing the html function', () => {
        assert.equal(
            JSON.stringify(makeTableHTML(parseCode('function f(){\nreturn 1;\n}'))),
            '"<table border=1><tr><th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr><tr><td>1</td><td>FunctionDeclaration</td><td>f</td><td></td><td></td></tr><tr><td>2</td><td>ReturnStatement</td><td></td><td></td><td>1</td></tr></table>"');
    });
});