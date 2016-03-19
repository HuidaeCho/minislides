'use strict';
// hotfix for missing ES6 support in UglifyJS.
// This is a fragile, wild hack and should NOT be used in serious projects
module.exports = code => {
    // for…of (not reusable)
    /*code = code.replace(/,\w+\.map\.call\(([^,]+),function\((\w+)\)\{([^}]+)}\),/g, ($, list, varName, statement) => {
        return `;for(${varName} of ${list})${statement};`;
    });*/ // currently only Firefox implements iterable NodeLists, so we must stick with .map.call()
    // template strings (works for one variable only)
    code = code.replace(/"([^"]+)"\+(\w+)\+"([^"]+)"/g, ($, before, between, after) => {
        return `\`${before}\$\{${between}\}${after}\``;
    });
    // wrapper
    code = code.replace(/^!function\(([^)]+)\)\{(.*)\}\((.*)\)/, ($, params, body, args) => {
        return `((${params})=>{${body}})(${args})`;
    });
    // other anonymous functions
    let oldCode;
    do {
        oldCode = code;
        code = code.replace(/function\(([^)]+)\)\{([^}]+)\}/g, ($, params, body) => {
            console.log(params);
            if (/,/.test(params)) {
                params = `(${params})`;
            }
            if (/,/.test(body)) {
                body = `{${body}}`;
            }
            return `${params}=>${body}`;
        });
    } while (code !== oldCode);
    return code;
};
