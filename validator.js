var loginForm = {
    // userName: "required:true | minlength:1| maxlength: 12 | pattern: ^[L]",
    // password: "required:true  | minlength:6| maxlength: 20",
    // age: "type: number | minvalue: 23",
    // acceptedTerms: "required:true | type: bool0ean",
    "nestedobj.f1": "required:true |type: string",
    "value1": "type:list"

}


var loginData = {
    // userName: "Lokesh",
    // password: "lokesh87",
    // age: 1,
    // acceptedTerms: false,
    // helo: 12,
    "nestedobj": {f1:23},
    value1: [1]
}

var validKeys = ["required", "minlength", "maxlength", "minvalue", "maxvalue", "pattern", "length"]
var configuration = {
    deleteOtherFields: true
}
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
var UpdateConfiguration = function (userConfig) {
    for (let config in userConfig) {
        if (configuration[config] != undefined) {
            configuration[config] = userConfig[config];
        }
    }
}
var ValidateConstraints = function (validationObject) {
    let errorObj = {};
    for (let field in validationObject) {
        for (let key in validationObject[field]) {

            if (validConstraints[key]) {
                // console.log("constrint iss ", typeof validationObject[field][key]);
                if (["minlength", "maxlength", "minvalue", "maxvalue", "length"].indexOf(key) >= 0) {
                    if (isNaN(validationObject[field][key].value)) {
                        if (!errorObj[field]) {
                            errorObj[field] = [];
                        }
                        errorObj[field].push({
                            key: key,
                            message: "Invalid value " + validationObject[field][key].value
                        })
                    }
                }
                if (key === 'required') {
                    if (["true", "false"].indexOf(validationObject[field][key].value) < 0) {
                        if (!errorObj[field]) {
                            errorObj[field] = [];
                        }
                        errorObj[field].push({
                            key: key,
                            message: "Invalid value " + validationObject[field][key].value
                        })
                    }
                }
                if (key === 'pattern') {
                    try {
                        if(validationObject[field][key].value.startsWith("/") && validationObject[field][key].value.endsWith("/"))
                        {
                            validationObject[field][key].value = validationObject[field][key].value.slice(1);
                            validationObject[field][key].value = validationObject[field][key].value.slice(0,-1);
                        }
                        let regex = new RegExp(validationObject[field][key].value);
                    } catch (e) {
                        errorObj[field].push({
                            key: key,
                            message: "Invalid pattern " + validationObject[field][key].value
                        })
                    }
                }

            } else {
                if (!errorObj[field]) {
                    errorObj[field] = [];
                }
                errorObj[field].push({
                    key: key,
                    message: "Invalid constraint " + key
                })
            }
        }
    }
    return (Object.keys(errorObj).length === 0 && errorObj.constructor === Object) ? null : errorObj
}
var CreateValidationObject = function (abstractValidationObj) {
    var transformedObject = {};
    for (let field in abstractValidationObj) {
        // console.log(field);
        // abstractValidationObj[field].split("|")
        transformedObject[field] = FiledValidationGenerator(field, abstractValidationObj);
    }
    // console.log("transformedObject ", transformedObject);
    return transformedObject;
    // console.log("transformed object ", transformedObject);
}

var FiledValidationGenerator = function (fieldName, abstractValidationObj) {

    let filedValidations = {};
    let constraints = abstractValidationObj[fieldName].split("|").map(elm => {
        return elm.trim();
    });
    // console.log("\n\n constraints ", constraints);
    for (constraint of constraints) {
        let entry = constraint.split(":").map(elm => {
            return elm.trim()
        });
        filedValidations[entry[0]] ={
            value: entry[1]
        };
        if(entry[2])
        {
            filedValidations[entry[0]].errorMessage = entry[2];
        }
            
    }
    // console.log(filedValidations);
    return filedValidations;
}
var Validate = function (validationsContainer, dataToValidate, options, callback) {

    return ValidationProcessor(validationsContainer, dataToValidate, options, function (errorObject, returningData) {
        if (callback)
            return callback(errorObject, returningData)

        // console.log("callback not found ");
        return new Promise((resolve, reject) => {
            if (errorObject)
                reject(errorObject)
            resolve(returningData);
        })
    });
}

var ValidationProcessor = function (validationsContainer, dataToValidate, options, callback) {
    UpdateConfiguration(options)
    var validationObject = CreateValidationObject(validationsContainer);
    // console.log("validateeee ", validationObject, dataToValidate);
    // console.log("validation object ", validationObject);
    let constraintErros = ValidateConstraints(validationObject);
    if (constraintErros) {
        // console.log("constraintErros ", constraintErros);
        return callback(constraintErros);
    }
    let errorObject = {};
    for (let field in validationObject) {
        let fieldError;
        if (fieldError = ValidateField(field, validationObject, dataToValidate)) {
            errorObject[field] = fieldError;
        }
    }
    if ((Object.keys(errorObject).length > 0 && errorObject.constructor === Object)) {
        return callback(errorObject);
    }
    let returningData = {};
    if (configuration.deleteOtherFields) {
        returningData = TrimUnknownFields(validationObject, dataToValidate);
    } else {
        returningData = dataToValidate;
    }
    return callback(null, returningData);
}

var TrimUnknownFields = function (validationObject, dataToValidate) {
    let returningData = {};

    for (let key in validationObject) {
        // console.log("inside trim function ", dataToValidate, key);
        if (GetKeyValue(dataToValidate,key) != undefined) {

            AddKeyToObject(returningData,key,GetKeyValue(dataToValidate,key));
            // returningData[key] = GetKeyValue(dataToValidate,key);
            // console.log("returning data", returningData[key])
        }
    }
    return returningData;
}
var ValidateField = function (fieldName, validationObject, dataToValidate) {
    let errorObject = {};
    let fieldValue = GetKeyValue(dataToValidate, fieldName);
    // console.log("fieldvalue iss ", fieldValue);
    let validations = validationObject[fieldName];
    // console.log("insie validateField ", fieldName, validationObject[fieldName].required)
    if (validations.required) {
        if (!fieldValue && fieldValue!==0) {
            errorObject = {
                field: fieldName,
                message: validations.required.errorMessage?validations.required.errorMessage:fieldName + " is required"
            };
            return errorObject;
        }

    }
    if (fieldValue == undefined)
        return null;
    if (validations.type) {
        // console.log("typeof fieldValue ", typeof fieldValue);
        if(validations.type.value == "list")
        {
            if(fieldValue.constructor !=Array)
            {
                errorObject = {
                    field: fieldName,
                    message: validations.type.errorMessage?validations.type.errorMessage:fieldName + " should be " + validations.type.value
                };
                return errorObject;
            }
        }
        else if (typeof fieldValue != validations.type.value) {
            errorObject = {
                field: fieldName,
                message: validations.type.errorMessage?validations.type.errorMessage:fieldName + " should be " + validations.type.value
            };
            return errorObject;

        }
    }
    if (validations.minlength) {
        // console.log("fieldValue.length ",fieldValue.length,validations.minlength,fieldName, fieldValue.length < validations.minlength)
        if (fieldValue.length < validations.minlength.value) {
            errorObject = {
                field: fieldName,
                message: validations.minlength.errorMessage?validations.minlength.errorMessage:fieldName + " should be minimum " + validations.minlength.value + " characters"
            };
            // console.log("minlength error ", fieldName)
            return errorObject;

        }
    }
    if (validations.maxlength) {

        if (fieldValue.length > validations.maxlength.value) {
            errorObject = {
                field: fieldName,
                message: validations.maxlength.errorMessage?validations.maxlength.errorMessage:fieldName + "length should not exceed " + validations.maxlength.value + " characters"
            };
            return errorObject;

        }
    }
    if (validations.length) {
        let fieldValue = fieldValue + "";
        if (fieldValue.length != validations.length.value) {
            errorObject = {
                field: fieldName,
                message: validations.length.errorMessage?validations.length.errorMessage:fieldName + " should be " + validations.length.value + " characters length."
            };
            return errorObject;

        }
    }
    if (validations.maxvalue) {
        // console.log("fieldvalue before parse int ", fieldValue);
        if (fieldValue > validations.maxvalue.value) {
            errorObject = {
                field: fieldName,
                message: validations.maxvalue.errorMessage?validations.maxvalue.errorMessage:fieldName + " value should not exceed " + validations.maxvalue.value
            };
            return errorObject;

        }
    }
    if (validations.minvalue) {
        if (fieldValue < validations.minvalue.value) {

            errorObject = {
                field: fieldName,
                message: validations.minvalue.errorMessage?validations.minvalue.errorMessage:fieldName + " should be greater than " + validations.minvalue.value
            };
            return errorObject;

        }
    }
    if (validations.pattern) {
        let pattern = new RegExp(validations.pattern.value);
        if (!pattern.test(fieldValue)) {
            errorObject = {
                field: fieldName,
                message: validations.pattern.errorMessage?validations.pattern.errorMessage:"Invalid  " + fieldName
            };
            return errorObject;

        }
        
    }
}
var GetKeyValue = function (obj, keyString) {
    obj = Object.assign({}, obj);
    keys = keyString.split(".");
    for (let key of keys) {
        if (obj[key] == undefined)
            return null;
        obj = obj[key];
    }
    return obj
}

var AddKeyToObject = function(obj, keyString, value)
{
    keys = keyString.split(".");
    // console.log(keys, obj)
    let newObj = obj;
    for(let i=0;i <keys.length-1; i++)
    {
         if(newObj[keys[i]] === undefined)
            {
                newObj[keys[i]] = {}
            }
        
        newObj = newObj[keys[i]];
    }
    // console.log(newObj)
    newObj[keys[keys.length-1]] = value;
    // for (let key of keys) {
    //     if (obj[key] == undefined)
    //         return null;
    //     obj = obj[key];
    // }
}

// var aa= {};
// AddKeyToObject(aa, "person", 1);
// console.log("object iss ", aa);
// var CheckAllConstraints = function(fieldName)

// Validate(loginForm, loginData, {
//     deleteOtherFields: false
// }, function (error, fields) {
//     console.log(error, fields);
// });

// Validate(loginForm, loginData).then(data => {
//  console.log("data from promise ", data);   
// }).catch(error => {
//     console.log("error iss ", error)
// })



// var f1 = function() {
//     console.log("helloo");
//     return f2(function(data){
//         return new Promise((resolve,reject) => {
//             reject("done");
//         })
//     })

// }
// var f2 = function(cb) {
//     return cb("hello")
//     // setTimeout(() =>{
//     //     return cb("hello")
//     // })
// }
// f1().then(data => {
//     console.log("dataaa ", data);
// }).catch(err => {
//     console.log("error iss ", err);
// })

module.exports = Validate;
