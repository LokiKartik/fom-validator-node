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
    "nestedobj": {
        f1: 23
    },
    value1: [1]
}

// var configuration = {
//     deleteOtherFields: true
// }



var fieldValidator = require("./field-validations");
var validationsGenerator = require("./validations-generator");
var constraintsValidator = require("./constraints-validator");
var utils = require("./util");
var interfaces = require("./index");
var configuration = {};
var Validate = function (validationsContainer, dataToValidate, options: interfaces.config, callback) {

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
    configuration = validationsGenerator.UpdateConfiguration(options);
    var validationObject = validationsGenerator.CreateValidationObject(validationsContainer);
    let constraintErros = constraintsValidator.ValidateConstraints(validationObject);
    if (constraintErros) {
        return callback(constraintErros);
    }
    let errorObject = {};
    for (let field in validationObject) {
        let fieldError = ValidateField(field, validationObject, dataToValidate);
        if (fieldError && fieldError.length > 0) {
            errorObject[field] = fieldError;
        }
    }
    if ((Object.keys(errorObject).length > 0 && errorObject.constructor === Object)) {
        return callback(errorObject);
    }
    let returningData = {};
    if (configuration.deleteOtherFields) {
        returningData = utils.TrimUnknownFields(validationObject, dataToValidate);
    } else {
        returningData = dataToValidate;
    }
    return callback(null, returningData);
}



var ValidateField = function (fieldName, validationObject, dataToValidate) {
    let errorObject = [];
    let fieldValue = utils.GetKeyValue(dataToValidate, fieldName);
    let validations = validationObject[fieldName];
    fieldValidator.ValidateRequiredCondition(fieldName, fieldValue, validations, errorObject);
    if (fieldValue == undefined)
        return errorObject;
    fieldValidator.ValidateDataType(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateMinLength(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateMaxLength(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateLength(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateMinValue(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateMaxValue(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidatePattern(fieldName, fieldValue, validations, errorObject);
    return errorObject;
}

module.exports = Validate;