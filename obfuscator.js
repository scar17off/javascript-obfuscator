function obfuscate(code, options) {
    const userScriptHeader = extractUserScriptHeader(code);
    let obfuscatedCode = code.replace(userScriptHeader, '');
    
    try {
        if (options.renameVariables) {
            obfuscatedCode = renameVariables(obfuscatedCode);
        }
        if (options.stringArray) {
            if (options.stringInsane) {
                obfuscatedCode = insaneStringTransform(obfuscatedCode, {
                    ...options,
                    stringEncryption: options.stringEncryption
                });
            } else {
                obfuscatedCode = transformStrings(obfuscatedCode, options);
            }
        } else if (options.stringEncryption) {
            obfuscatedCode = encryptStrings(obfuscatedCode);
        }
        if (options.controlFlowFlattening) {
            obfuscatedCode = flattenControlFlow(obfuscatedCode);
        }
        if (options.deadCodeInjection) {
            obfuscatedCode = injectDeadCode(obfuscatedCode);
        }
        if (options.debugProtection) {
            obfuscatedCode = addDebugProtection(obfuscatedCode);
        }
        if (options.functionReordering) {
            obfuscatedCode = reorderFunctions(obfuscatedCode);
        }
        if (options.constantFolding) {
            obfuscatedCode = foldConstants(obfuscatedCode);
        }
        if (options.codeSplitting) {
            obfuscatedCode = splitCode(obfuscatedCode);
        }
    } catch (error) {
        console.error("Error during obfuscation:", error);
        return "Error: " + error.message;
    }
    
    // Return the header and obfuscated code separately
    return { header: userScriptHeader, code: obfuscatedCode };
}

function extractUserScriptHeader(code) {
    const headerRegex = /\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/;
    const match = code.match(headerRegex);
    return match ? match[0] + '\n' : '';
}

function renameVariables(code) {
    const variableRegex = /\b(var|let|const)\s+(\w+)\b/g;
    const variables = new Set();
    code.replace(variableRegex, (_, __, varName) => variables.add(varName));
    const variableMap = new Map([...variables].map((v, i) => [v, `_${i}`]));
    return code.replace(/\b(\w+)\b/g, match => variableMap.get(match) || match);
}

function encryptStrings(code) {
    return code.replace(/"([^"]*)"/g, (_, str) => {
        const encrypted = btoa(str);
        return `atob("${encrypted}")`;
    });
}

function flattenControlFlow(code) {
    const statements = code.split(';').filter(s => s.trim() !== '');
    const flattened = `
    (function(){
        var _index = 0;
        var _fns = [
            ${statements.map((stmt, i) => `function(){${stmt}; _index = ${i + 1};}`).join(',\n')}
        ];
        while (_index < _fns.length) {
            _fns[_index]();
        }
    })();
    `;
    return flattened;
}

function injectDeadCode(code) {
    const deadCode = `
    if (false) {
        console.log("This code will never run");
        alert("Unreachable");
    }
    `;
    return deadCode + code;
}

function addDebugProtection(code) {
    const protection = `
    (function(){
        var _0x3d88=['debug','exception','trace','log','warn','error','table'];
        (function(_0x36bc23,_0x3d8889){
            var _0x2a4c4d=function(_0x44e8da){
                while(--_0x44e8da){
                    _0x36bc23['push'](_0x36bc23['shift']());
                }
            };
            _0x2a4c4d(++_0x3d8889);
        }(_0x3d88,0x1d3));
        var _0x2a4c=function(_0x36bc23,_0x3d8889){
            _0x36bc23=_0x36bc23-0x0;
            var _0x2a4c4d=_0x3d88[_0x36bc23];
            return _0x2a4c4d;
        };
        (function(){
            var _0x1ab6ea=function(){
                var _0x54c45b;
                try{
                    _0x54c45b=Function('return\\x20(function()\\x20'+'{}.constructor(\\x22return\\x20this\\x22)(\\x20)'+');')();
                }catch(_0x21f569){
                    _0x54c45b=window;
                }
                return _0x54c45b;
            };
            var _0x2c5f2b=_0x1ab6ea();
            var _0x5de1fd=['log',_0x2a4c('0x0'),_0x2a4c('0x1'),_0x2a4c('0x2'),_0x2a4c('0x3'),_0x2a4c('0x4'),_0x2a4c('0x5')];
            for(var _0x1e0f66=0x0;_0x1e0f66<_0x5de1fd[_0x2a4c('0x6')];_0x1e0f66++){
                (function(_0x1d6e0){
                    var _0x2f3ec9=_0x2c5f2b[_0x1d6e0]||_0x2c5f2b['console'][_0x1d6e0];
                    Object['defineProperty'](_0x2c5f2b['console'],_0x1d6e0,{'value':function(){
                        debugger;
                        return _0x2f3ec9['apply'](_0x2c5f2b['console'],arguments);
                    },'configurable':!![]});
                }(_0x5de1fd[_0x1e0f66]));
            }
        }());
    })();
    `;
    return protection + code;
}

function reorderFunctions(code) {
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*\{[^}]*\}/g;
    const functions = code.match(functionRegex) || [];
    const shuffledFunctions = functions.sort(() => Math.random() - 0.5);
    return code.replace(functionRegex, () => shuffledFunctions.pop());
}

function foldConstants(code) {
    return code.replace(/(\d+)\s*([+\-*/])\s*(\d+)/g, (_, a, op, b) => {
        return eval(`${a}${op}${b}`);
    });
}

function splitCode(code) {
    const parts = code.split(';');
    const shuffledParts = parts.sort(() => Math.random() - 0.5);
    const reconstructor = `
    (function(){
        var parts = ${JSON.stringify(shuffledParts)};
        var code = parts.join(';');
        eval(code);
    })();
    `;
    return reconstructor;
}

function getIndex(index, options, arrayLength) {
    const shiftedIndex = (index + (options.stringArrayIndexShift || 0)) % arrayLength;
    if (options.stringArrayIndexesType === 'hexadecimal') {
        return `[0x${shiftedIndex.toString(16)}]`;
    }
    return `[${shiftedIndex}]`;
}

function transformStrings(code, options) {
    if (!options.stringArray) return code;

    const strings = new Set();
    code = code.replace(/"([^"]*)"/g, (match, str) => {
        if (str.length >= options.stringArrayThreshold) {
            strings.add(str);
            return `_0x${strings.size.toString(16)}`;
        }
        return match;
    });

    let stringArray = Array.from(strings);
    if (options.stringArrayShuffle) {
        stringArray = stringArray.sort(() => Math.random() - 0.5);
    }

    if (options.stringEncryption) {
        stringArray = stringArray.map(str => btoa(str));
    }

    const stringMap = new Map(stringArray.map((str, i) => [str, i]));

    const arrayName = `_0x${Math.random().toString(36).substr(2, 6)}`;
    const arrayDeclaration = `var ${arrayName} = ${JSON.stringify(stringArray)};`;
    code = code.replace(/_0x([0-9a-f]+)/g, (match, index) => {
        const originalIndex = parseInt(index, 16) - 1;
        const str = stringArray[originalIndex];
        const arrayAccess = `${arrayName}${getIndex(stringMap.get(str), options, stringArray.length)}`;
        return options.stringEncryption ? `atob(${arrayAccess})` : arrayAccess;
    });

    return arrayDeclaration + code;
}

function encryptAndTransformStrings(code, options) {
    const strings = new Set();
    code = code.replace(/"([^"]*)"/g, (match, str) => {
        if (str.length >= options.stringArrayThreshold) {
            const encrypted = btoa(str);
            strings.add(encrypted);
            return `_0x${strings.size.toString(16)}`;
        }
        return match;
    });

    let stringArray = Array.from(strings);
    if (options.stringArrayShuffle) {
        stringArray = stringArray.sort(() => Math.random() - 0.5);
    }

    const stringMap = new Map(stringArray.map((str, i) => [str, i]));
    const indexShift = options.stringArrayIndexShift || 0;

    const getIndex = (index) => {
        const shiftedIndex = (index + indexShift) % stringArray.length;
        if (options.stringArrayIndexesType === 'hexadecimal') {
            return `0x${shiftedIndex.toString(16)}`;
        }
        return shiftedIndex;
    };

    const arrayName = `_0x${Math.random().toString(36).substr(2, 6)}`;
    const arrayDeclaration = `var ${arrayName} = ${JSON.stringify(stringArray)};`;
    code = code.replace(/_0x([0-9a-f]+)/g, (match, index) => {
        const originalIndex = parseInt(index, 16) - 1;
        const str = stringArray[originalIndex];
        return `atob(${arrayName}[${getIndex(stringMap.get(str))}])`;
    });

    return arrayDeclaration + code;
}

function insaneStringTransform(code, options) {
    const threshold = options.stringInsaneThreshold || 2;
    const dictionary = new Set();
    const strings = new Set();
    const arrayName = `_0x${Math.random().toString(36).substr(2, 6)}`;

    function padBase64(str) {
        while (str.length % 4) {
            str += '=';
        }
        return str;
    }

    // First pass: build dictionary
    code = code.replace(/"([^"]*)"/g, (match, str) => {
        if (str.length >= options.stringArrayThreshold) {
            for (let i = 0; i < str.length; i += threshold) {
                const chunk = str.substr(i, threshold);
                const encodedChunk = options.stringEncryption ? btoa(chunk) : chunk;
                dictionary.add(encodedChunk);
            }
            strings.add(str);
            return `_0x${strings.size.toString(16)}`;
        }
        return match;
    });

    let dictionaryArray = Array.from(dictionary);
    if (options.stringArrayShuffle) {
        dictionaryArray = dictionaryArray.sort(() => Math.random() - 0.5);
    }

    const stringMap = new Map();

    // Second pass: transform strings
    code = code.replace(/_0x([0-9a-f]+)/g, (match, index) => {
        const str = Array.from(strings)[parseInt(index, 16) - 1];
        if (str === undefined) {
            console.warn(`String not found for index: ${index}`);
            return match; // Return the original match if string not found
        }
        if (!stringMap.has(str)) {
            const transformed = str.match(new RegExp(`.{1,${threshold}}`, 'g'))
                .map(chunk => {
                    const encryptedChunk = options.stringEncryption ? btoa(chunk) : chunk;
                    const chunkIndex = dictionaryArray.indexOf(encryptedChunk);
                    return `${arrayName}${getIndex(chunkIndex, options, dictionaryArray.length)}`;
                })
                .join(' + ');
            stringMap.set(str, transformed);
        }
        const transformedStr = stringMap.get(str);
        if (options.stringEncryption) {
            return `(function(s) { var b = findBase64Strings(padBase64(s)); return b && b.length ? b.map(x => atob(x)).join('') : s; })(${transformedStr})`;
        } else {
            return transformedStr;
        }
    });

    const arrayDeclaration = `var ${arrayName} = ${JSON.stringify(dictionaryArray)};`;
    const padFunction = `function padBase64(str) { while (str.length % 4) { str += '='; } return str; }`;
    const isBase64Function = `
    function isBase64(str) {
        try {
            return btoa(atob(str)) === str;
        } catch (e) {
            return false;
        }
    }`;
    const findBase64StringsFunction = `
    function findBase64Strings(text) {
        if (typeof text !== 'string') return [];
        const base64Pattern = /(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;
        const potentialBase64Strings = text.match(base64Pattern) || [];
        return potentialBase64Strings.filter(str => str.length > 0 && isBase64(str));
    }`;

    return arrayDeclaration + padFunction + isBase64Function + findBase64StringsFunction + code;
}

function isBase64(str) {
  try {
      if (str.length % 4 !== 0) {
          return false;
      }
      atob(str);
      return true;
  } catch (e) {
      return false;
  }
}

function findBase64Strings(text) {
  const base64Pattern = /(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;
  const potentialBase64Strings = text.match(base64Pattern) || [];
  const validBase64Strings = potentialBase64Strings.filter(str => str.length > 0 && isBase64(str));

  return validBase64Strings;
}