var validConstraints = {
    required: "boolean",
    type: "string",
    minlength: "number",
    maxlength: "number",
    minvalue: "number",
    maxvalue: "number",
    pattern: "string",
    length: "number"
};

var ValidateConstraints = function (validationObject) {
    let errorObj = {};
    for (let field in validationObject) {
        for (let key in validationObject[field]) {

            if (validConstraints[key]) {
                if (["minlength", "maxlength", "minvalue", "maxvalue", "length"].indexOf(key) >= 0) {
                    if (isNaN(validationObject[field][key].value)) {
                        if (!errorObj[field]) {
                            errorObj[field] = [];
                        }
                        errorObj[field].push("Invalid value " + validationObject[field][key].value +" given in validation Object.")
                    }
                }
                if (key === 'required') {
                    if (["true", "false"].indexOf(validationObject[field][key].value) < 0) {
                        if (!errorObj[field]) {
                            errorObj[field] = [];
                        }
                        errorObj[field].push("Invalid value " + validationObject[field][key].value+" given in validation Object.")
                    }
                }
                if (key === 'pattern') {
                    try {
                        if (validationObject[field][key].value.startsWith("/") && validationObject[field][key].value.endsWith("/")) {
                            validationObject[field][key].value = validationObject[field][key].value.slice(1);
                            validationObject[field][key].value = validationObject[field][key].value.slice(0, -1);
                        }
                        let regex = new RegExp(validationObject[field][key].value);
                    } catch (e) {
                        errorObj[field].push("Invalid pattern " + validationObject[field][key].value+" given in validation Object.")
                    }
                }

            } else {
                if (!errorObj[field]) {
                    errorObj[field] = [];
                }
                errorObj[field].push("Invalid constraint " + key+" given in validation Object.")
            }
        }
    }
    return (Object.keys(errorObj).length === 0 && errorObj.constructor === Object) ? null : errorObj
}

module.exports = {
    ValidateConstraints: ValidateConstraints
}