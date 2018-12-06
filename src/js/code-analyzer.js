import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

let obList = [];

const parseCode = (codeToParse) => {
    let res = esprima.parseScript(codeToParse, {loc : true});
    return res;
};

export function makeTableHTML(parsedCode) {
    let myArray = makeTable(parsedCode);
    let result = '<table border=1>';
    myArray = [['Line', 'Type', 'Name', 'Condition', 'Value']].concat(myArray);
    for(let i=0; i<myArray.length; i++) {
        result += '<tr>';
        for(let j=0; j<myArray[i].length; j++){
            if  (i === 0)
                result += '<th>'+myArray[i][j]+'</th>';
            else
                result += '<td>'+myArray[i][j]+'</td>';
        }
        result += '</tr>';
    }
    result += '</table>';
    return result;
}

export const makeTable = (parsedCode) => {
    obList = [];
    parsedCode.body.forEach ((exp) =>{
        parseExp(exp);
    });

    console.log(JSON.stringify(obList));
    return obList;
};

const parseExp = (exp) => {
    exp === null | exp === undefined ? retEmpty() :
        exp.type === 'FunctionDeclaration' |
    exp.type === 'VariableDeclaration' |
    exp.type === 'ExpressionStatement' |
    exp.type === 'BlockStatement' ? parseFuncDecExpBlock(exp) :
            exp.type === 'WhileStatement' |
        exp.type === 'ForStatement' |
        exp.type === 'IfStatement' ? parseCond(exp) :
                parseReturn(exp);
};

const retEmpty = () =>{
    return [];
};

const parseCond = (exp) =>{
    exp.type === 'WhileStatement' ? parseWhile(exp) :
        exp.type === 'ForStatement' ? parseFor(exp) :
            parseIf(exp);
};

const parseFuncDecExpBlock = (exp) =>{
    exp.type === 'FunctionDeclaration' ? parseFun(exp) :
        exp.type === 'VariableDeclaration' ? parseVarDec(exp.declarations) :
            exp.type === 'ExpressionStatement' ? parseAssignment(exp.expression) :
                parseBlock(exp.body);

};

const parseFun = (funDec) => {
    let toAdd = [funDec.loc.start.line,
        funDec.type,
        funDec.id.name,
        '',
        ''];
    obList.push(toAdd);
    parseParams(funDec.params);
    funDec.body.body.forEach ((exp) =>{
        parseExp(exp);
    });
};

const parseParams = (paramsArray) => {
    paramsArray.forEach ((param) => {
        let toAdd = [param.loc.start.line,
            param.type,
            param.name,
            '',
            ''];
        obList.push(toAdd);
    });
};

const parseVarDec = (varDecArray) => {
    varDecArray.forEach ((varDec) => {
        let val = '';
        if(varDec.init !== null && varDec.init !== undefined)
            val = escodegen.generate(varDec.init);
        let toAdd = [varDec.loc.start.line,
            varDec.type,
            varDec.id.name,
            '',
            val];
        obList.push(toAdd);
    });
};

const parseAssignment = (ass) => {
    let toAdd = [ass.loc.start.line,
        ass.type,
        ass.left.name,
        '',
        escodegen.generate(ass.right)];
    obList.push(toAdd);
};

const parseWhile = (whi) => {
    let toAdd = [whi.loc.start.line,
        whi.type,
        '',
        escodegen.generate(whi.test),
        ''];
    obList.push(toAdd);
    parseExp(whi.body);
};

const parseFor = (fo) => {
    let toAdd = [fo.loc.start.line,
        fo.type,
        '',
        escodegen.generate(fo.test),
        ''];
    obList.push(toAdd);
    parseVarDec(fo.init.declarations);
    parseExp(fo.body);
};

const parseBlock = (block) => {
    block.forEach((exp) => {
        parseExp(exp);
    });
};

const parseIf = (ifState) => {
    let toAdd = [ifState.loc.start.line,
        ifState.type,
        '',
        escodegen.generate(ifState.test),
        ''];
    obList.push(toAdd);
    parseExp(ifState.consequent);
    parseExp(ifState.alternate);
};

const parseReturn = (returnState) => {
    let toAdd = [returnState.loc.start.line,
        returnState.type,
        '',
        '',
        escodegen.generate(returnState.argument)];
    obList.push(toAdd);
};

export {parseCode};
