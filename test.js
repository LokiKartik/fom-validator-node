var formValidatorNode = require("./validator");

var registrationForm = {
	userName : "required: true: Username is required | pattern:/^[A-Za-z0-9]{3,}$/: Given pattern is invalid | minlength: 4 | maxlength:20 | type: string ",
	password: "required: true | minlength:4 | maxlength:30 | type: string",
	age: "minvalue:13 | maxvalue:65 | type: number"
}

var registrationData = {
	userName: "username",
	password: "password",
	age: 19,
	acceptedTerms: false
}

formValidatorNode(registrationForm,registrationData,{deleteOtherFields:false}).then(data=>{
    console.log(data)
}).catch(er=>{
    console.error(er)
})
