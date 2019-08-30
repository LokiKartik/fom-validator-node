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
    // console.log("validateeee ", validationObject, dataToValidate);
    // console.log("validation object ", validationObject);
    let constraintErros = constraintsValidator.ValidateConstraints(validationObject);
    if (constraintErros) {
        // console.log("constraintErros ", constraintErros);
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
    // console.log("fieldvalue iss ", fieldValue);
    let validations = validationObject[fieldName];
    // console.log("insie validateField ", fieldName, validationObject[fieldName].required)
    fieldValidator.ValidateRequiredCondition(fieldName, fieldValue, validations, errorObject);
    if (fieldValue == undefined)
        return null;
    fieldValidator.ValidateDataType(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateMinLength(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateMaxLength(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateLength(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateMinValue(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidateMaxValue(fieldName, fieldValue, validations, errorObject);
    fieldValidator.ValidatePattern(fieldName, fieldValue, validations, errorObject);
    return errorObject;
    // if (validations.required) {
    //     if (!fieldValue && fieldValue !== 0) {
    //         errorObject = {
    //             field: fieldName,
    //             message: validations.required.errorMessage ? validations.required.errorMessage : fieldName + " is required"
    //         };
    //         return errorObject;
    //     }

    // }

    // if (validations.type) {
    //     // console.log("typeof fieldValue ", typeof fieldValue);
    //     if (validations.type.value == "list") {
    //         if (fieldValue.constructor != Array) {
    //             errorObject = {
    //                 field: fieldName,
    //                 message: validations.type.errorMessage ? validations.type.errorMessage : fieldName + " should be " + validations.type.value
    //             };
    //             return errorObject;
    //         }
    //     } else if (typeof fieldValue != validations.type.value) {
    //         errorObject = {
    //             field: fieldName,
    //             message: validations.type.errorMessage ? validations.type.errorMessage : fieldName + " should be " + validations.type.value
    //         };
    //         return errorObject;

    //     }
    // }
    // if (validations.minlength) {
    //     // console.log("fieldValue.length ",fieldValue.length,validations.minlength,fieldName, fieldValue.length < validations.minlength)
    //     if (fieldValue.length < validations.minlength.value) {
    //         errorObject = {
    //             field: fieldName,
    //             message: validations.minlength.errorMessage ? validations.minlength.errorMessage : fieldName + " should be minimum " + validations.minlength.value + " characters"
    //         };
    //         // console.log("minlength error ", fieldName)
    //         return errorObject;

    //     }
    // }
    // if (validations.maxlength) {

    //     if (fieldValue.length > validations.maxlength.value) {
    //         errorObject = {
    //             field: fieldName,
    //             message: validations.maxlength.errorMessage ? validations.maxlength.errorMessage : fieldName + "length should not exceed " + validations.maxlength.value + " characters"
    //         };
    //         return errorObject;

    //     }
    // }
    // if (validations.length) {
    //     let fieldValue = fieldValue + "";
    //     if (fieldValue.length != validations.length.value) {
    //         errorObject = {
    //             field: fieldName,
    //             message: validations.length.errorMessage ? validations.length.errorMessage : fieldName + " should be " + validations.length.value + " characters length."
    //         };
    //         return errorObject;

    //     }
    // }
    // if (validations.maxvalue) {
    //     // console.log("fieldvalue before parse int ", fieldValue);
    //     if (fieldValue > validations.maxvalue.value) {
    //         errorObject = {
    //             field: fieldName,
    //             message: validations.maxvalue.errorMessage ? validations.maxvalue.errorMessage : fieldName + " value should not exceed " + validations.maxvalue.value
    //         };
    //         return errorObject;

    //     }
    // }
    // if (validations.minvalue) {
    //     if (fieldValue < validations.minvalue.value) {

    //         errorObject = {
    //             field: fieldName,
    //             message: validations.minvalue.errorMessage ? validations.minvalue.errorMessage : fieldName + " should be greater than " + validations.minvalue.value
    //         };
    //         return errorObject;

    //     }
    // }
    // if (validations.pattern) {
    //     let pattern = new RegExp(validations.pattern.value);
    //     if (!pattern.test(fieldValue)) {
    //         errorObject = {
    //             field: fieldName,
    //             message: validations.pattern.errorMessage ? validations.pattern.errorMessage : "Invalid  " + fieldName
    //         };
    //         return errorObject;

    //     }

    // }
}

module.exports = Validate;