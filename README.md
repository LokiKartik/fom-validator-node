
### Installation

```sh

$ npm install form-validator-node

```

### Usage

  ```sh
	var validator = require("form-validator-node")
	var formValidations = {
		fieldName1: condition1: value: errorMessage(optional) | condition2: value: errorMessage(optional)
	}
	var options = {
		returnAllFields: true | false
	}
	validator(formValidations, formData,options,function(error, verifiedData){
		//handle errors  
	})
```

### Options

##### returnAllFields 

  Returns only fields in validation object if "returnAllFields" value is false. Else returns all fields. Default value is true. 
  

### Available Validations

&nbsp;&nbsp;&nbsp;&nbsp; required:  true : &lt;optional error message>

&nbsp;&nbsp;&nbsp;&nbsp; type: &lt;string|number|boolean|list>: &lt;optional error message>

&nbsp;&nbsp;&nbsp;&nbsp; minvalue: &lt;number>: &lt;optional error message>

&nbsp;&nbsp;&nbsp;&nbsp; maxvalue: &lt;number>: &lt;optional error message>

&nbsp;&nbsp;&nbsp;&nbsp; minlength: &lt;number>: &lt;optional error message>
 
&nbsp;&nbsp;&nbsp;&nbsp; maxlength: &lt;number>: &lt;optional error message>

&nbsp;&nbsp;&nbsp;&nbsp; pattern: &lt;regex>: &lt;optional error message>

#### Example
```sh
var validator = require("form-validator-node")

var registrationForm = {
userName : "required: true | pattern:/^[A-Za-z0-9]*$/: Username is not in given pattern | minlength: 4 | maxlength:20 | type: string",
password: "required: true | minlength:4 | maxlength:30 | type: string",
age: "minvalue:13 | maxvalue:65 | type: number: Age should be a number" ,
acceptedTerms: "type: boolean"
}
var registrationData = {
userName: "username",
password: "password",
age: 25,
acceptedTerms: true
}

/*In callback way:: */
validator(registrationForm,registrationData,{},function(error, verifiedData){
})
/*With promises:*/
validator(registrationForm,registrationData,{}).then(verifiedData=>{
}).catch(validationError => {
})

```
