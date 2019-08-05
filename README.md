
### Installation

```sh

$ npm install form-validator-node

```

### Usage

  ```sh
	var validator = require("form-validator-node")
	var formValidations = {
		fieldName1: <conditions seperated by "|">,
		fieldName2: <conditions seperated by "|">
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

&nbsp;&nbsp;&nbsp;&nbsp; required:  true

&nbsp;&nbsp;&nbsp;&nbsp; type: &lt;string|number|boolean|list>

&nbsp;&nbsp;&nbsp;&nbsp; minvalue: &lt;number>

&nbsp;&nbsp;&nbsp;&nbsp; maxvalue: &lt;number>

&nbsp;&nbsp;&nbsp;&nbsp; minlength: &lt;number>
 
&nbsp;&nbsp;&nbsp;&nbsp; maxlength: &lt;number>

&nbsp;&nbsp;&nbsp;&nbsp; pattern: &lt;regex>

#### Example

```sh

var validator = require("form-validator-node")

var registrationForm = {
userName : "required: true | pattern:/^[A-Za-z0-9]*$/ | minlength: 4 | maxlength:20 | type: string",
password: "required: true | minlength:4 | maxlength:30 | type: string",
age: "minvalue:13 | maxvalue:65 | type: number",
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
