
A simple [node](http://nodejs.org) module for validating request parameters and objects.

This module supports custom error messages.

### Installation

```sh

$ npm install form-validator-node

```

### Usage


A simple example showing object validation.
```js

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
	
```
 
A simple express example showing login form validation.

 ```js
var validator = require("form-validator-node");

app.post("/login",function(req,res){
	var loginFormValidations = {
		userName: "required:true | minlength:6 | maxlength:30",
		password: "minlength:6 | maxlength:50"
	}
	var options = {};
	validator(loginFormValidations, req.body,options,function(validationErrors, verifiedData){
		if(validationErrors)
		{
			res.send(400).send(validationErrors);
		}
	})
})
```



A simple express example showing login form validation using promises.

 ```js
var validator = require("form-validator-node");

app.post("/login",function(req,res){
	var loginFormValidations = {
		userName: "required:true | minlength:6 | maxlength:30",
		password: "minlength:6 | maxlength:50"
	}
	var options = {};

	validator(loginFormValidations,req.body,options).then(verifiedData=>{
		console.log(verifiedData);
	}).catch(validationErrors => {
		res.send(400).send(validationErrors);
	})

})
```


A simple express example showing login form validation with custom error messages.

 ```js
var validator = require("form-validator-node");

app.post("/login",function(req,res){
	var loginFormValidations = {
		userName: `required:true:Username is a mandatory field, Please fill out the field. | 
		minlength:6:userName length should be atleast 6 characters. | 
		maxlength:30:userName lenght exceeds 30 characters.`,
		password: "minlength:6 | maxlength:50"
	}
	var options = { deleteOtherFields : true };  // Options object will be explained in below sections.
	validator(loginFormValidations, req.body,options,function(validationErrors, verifiedData){
		if(validationErrors)
		{
			res.send(400).send(validationErrors);
		}
	})
})
```

### Options

**deleteOtherFields**   
Returns only fields in validation object if "deleteOtherFields" value is true. Else returns all fields. Default value is true. 
  

### Available Validations

**required:  true : &lt;optional error message>**  
Value in the object must exist for given field.

**type: &lt;string | number | boolean | list>: &lt;optional error message>**  
Value in the object must be the given type.

**minvalue: &lt;number>: &lt;optional error message>**  
This will be used for number data types.Field value in the object should not be lower than the specified value.

**maxvalue: &lt;number>: &lt;optional error message>**  
This will be used for number data types.Field value in the object should not be greater than the specified value.

**minlength: &lt;number>: &lt;optional error message>**  
Length of the field value in the object  should not be lower than the specified value.

**maxlength: &lt;number>: &lt;optional error message>**  
Length of the field value in the object  should not be greater than the specified value.

**pattern: &lt;regex>: &lt;optional error message>**  
Field value must follow given pattern.
