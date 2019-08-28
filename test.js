var validator = require("./validator");

// var registrationForm = {
// 	userName : "required: true: Username is required | pattern:/^[A-Za-z0-9]{3,}$/: Given pattern is invalid | minlength: 4 | maxlength:20 | type: string ",
// 	password: "required: true | minlength:4 | maxlength:30 | type: string",
// 	age: "minvalue:13 | maxvalue:65 | type: number"
// }

// var registrationData = {
// 	userName: "username",
// 	password: "password",
// 	age: 19,
// 	acceptedTerms: false
// }

// formValidatorNode(registrationForm,registrationData,{deleteOtherFields:false}).then(data=>{
//     console.log(data)
// }).catch(er=>{
//     console.error(er)
// })




var validator = require("form-validator-node");

var userInfoValidations = {
	firstName: "type: string | required:true | minlength:3 | maxlength: 40 | pattern:/^[A-Za-z0-9]*$/",
	lastName: "type: string | minlength:1 | maxlength: 40 | pattern:/^[A-Za-z0-9]*$/",
	userName: "type: string | required:true | minlength:6 | maxlength:30 | pattern:/^[A-Za-z0-9_]*$/",
	age: "required:true | type:number | minvalue:13 | maxvalue:70",
}

var userObject = {
	firstName: "daniel",
	lastName: "radcliffe",
	userName: "DanJRadcliffeNL",
	age: 30
}
var options = {};
validator(userInfoValidations, userObject,options,function(validationErrors, verifiedData){
	if(validationErrors)
	{
		console.log(validationErrors);
	}
})