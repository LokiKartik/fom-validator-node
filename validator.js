var fieldValidator = require("./src/field-validations");
var validationsGenerator = require("./src/validations-generator");
var constraintsValidator = require("./src/constraints-validator");
var utils = require("./src/util");
var configuration = {};
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