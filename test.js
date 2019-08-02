var formValidatorNode = require("./validator");

var registrationForm = {
	userName : "required: true | minlength: 4 | maxlength:20 | type: string",
	password: "required: true | minlength:14 | maxlength:30 | type: string",
	age: "minvalue:13 | maxvalue:65 | type: number",
	acceptedTerms: "type: boolean"
}

var registrationData = {
	userName: "username",
	password: "password",
	age: 25,
	acceptedTerms: "    "
}

formValidatorNode(registrationForm,registrationData,{}).then(data=>{
    console.log(data)
}).catch(er=>{
    console.error(er)
})