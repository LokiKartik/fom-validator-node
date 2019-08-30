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
    let newObj = obj;
    for(let i=0;i <keys.length-1; i++)
    {
         if(newObj[keys[i]] === undefined)
            {
                newObj[keys[i]] = {}
            }
        
        newObj = newObj[keys[i]];
    }
    newObj[keys[keys.length-1]] = value;
   
}

module.exports = {
    TrimUnknownFields: TrimUnknownFields,
    GetKeyValue: GetKeyValue
}