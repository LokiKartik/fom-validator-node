
var ValidateRequiredCondition = function (fieldName, fieldValue, validations, errorObject) {
    if (validations.required) {
        if (!fieldValue && fieldValue !== 0) {
            errorObject.push(validations.required.errorMessage ? validations.required.errorMessage : fieldName + " is required");
        }
    }
}
var ValidateDataType = function (fieldName, fieldValue, validations, errorObject) {
    if (validations.type) {
        // console.log("typeof fieldValue ", typeof fieldValue);
        if (validations.type.value == "list") {
            if (fieldValue.constructor != Array) {
                errorObject.push(validations.type.errorMessage ? validations.type.errorMessage : fieldName + " should be " + validations.type.value);
            }
        } else if (typeof fieldValue != validations.type.value) {
            errorObject.push(validations.type.errorMessage ? validations.type.errorMessage : fieldName + " should be " + validations.type.value);
        }
    }
}

var ValidateMinLength = function (fieldName, fieldValue, validations, errorObject) {
    if (validations.minlength) {
        // console.log("fieldValue.length ",fieldValue.length,validations.minlength,fieldName, fieldValue.length < validations.minlength)
        if (fieldValue.length < validations.minlength.value) {
            errorObject.push(validations.minlength.errorMessage ? validations.minlength.errorMessage : fieldName + " should be minimum " + validations.minlength.value + " characters");
        }
    }
}
var ValidateMaxLength = function (fieldName, fieldValue, validations, errorObject) {
    if (validations.maxlength) {

        if (fieldValue.length > validations.maxlength.value) {
            errorObject.push(validations.maxlength.errorMessage ? validations.maxlength.errorMessage : fieldName + "length should not exceed " + validations.maxlength.value + " characters")
        }
    }
}
var ValidateLength = function (fieldName, fieldValue, validations, errorObject) {
    if (validations.length) {
        fieldValue = fieldValue + "";
        if (fieldValue.length != validations.length.value) {
            errorObject.push(validations.length.errorMessage ? validations.length.errorMessage : fieldName + " should be " + validations.length.value + " characters length.")
        }

    }
}
var ValidateMaxValue = function (fieldName, fieldValue, validations, errorObject) {
    if (validations.maxvalue) {
        // console.log("fieldvalue before parse int ", fieldValue);
        if (fieldValue > validations.maxvalue.value) {
            errorObject.push(validations.maxvalue.errorMessage ? validations.maxvalue.errorMessage : fieldName + " value should not exceed " + validations.maxvalue.value)
        }
    }
}
var ValidateMinValue = function (fieldName, fieldValue, validations, errorObject) {
    if (validations.minvalue) {
        if (fieldValue < validations.minvalue.value) {
            errorObject.push(validations.minvalue.errorMessage ? validations.minvalue.errorMessage : fieldName + " should be greater than " + validations.minvalue.value)
        }
    }
}
var ValidatePattern = function (fieldName, fieldValue, validations, errorObject) {
    if (validations.pattern) {
        let pattern = new RegExp(validations.pattern.value);
        if (!pattern.test(fieldValue)) {
            errorObject.push(validations.pattern.errorMessage ? validations.pattern.errorMessage : "Invalid  " + fieldName)
        }

    }
}
module.exports =  {
    ValidateRequiredCondition: ValidateRequiredCondition,
    ValidateDataType:ValidateDataType,
    ValidateMinLength:ValidateMinLength,
    ValidateMaxLength:ValidateMaxLength,
    ValidateLength:ValidateLength,
    ValidateMaxValue:ValidateMaxValue,
    ValidateMinValue:ValidateMinValue,
    ValidatePattern:ValidatePattern
}
