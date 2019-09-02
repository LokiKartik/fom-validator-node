var configuration = {
    deleteOtherFields: true
}

var UpdateConfiguration = function (userConfig) {
    for (let config in userConfig) {
        if (configuration[config] != undefined) {
            configuration[config] = userConfig[config];
        }
    }
    return configuration;
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

module.exports = {
    UpdateConfiguration: UpdateConfiguration,
    CreateValidationObject: CreateValidationObject
}