/********f************

    Do not alter this comment block. 
    Only fill out the information below.

    Project 4 Validation
    Name: Noah Yanga
    Date: December 9, 2023
    Description: Project 4 Validation

*********************/
/*
 * Handles the submit event of the survey form
 *
 * param e  A reference to the event object
 * return   True if no validation errors; False if the form has
 *          validation errors
 */
function validate(e) {
	// Hides all error elements on the page
	hideErrors();

	// Determine if the form has errors
	if (formHasErrors()) {
		// Prevents the form from submitting
		e.preventDefault();

		return false;
	}

	return true;
}

/*
 * Handles the reset event for the form.
 *
 * param e  A reference to the event object
 * return   True allows the reset to happen; False prevents
 *          the browser from resetting the form.
 */
function resetForm(e) {
	// Confirm that the user wants to reset the form.
	if (confirm('Clear form?')) {
		// Ensure all error fields are hidden
		hideErrors();

		// Set focus to the first text field on the page
		document.getElementById("name").focus();

		return true;
	}

	// Prevents the form from resetting
	e.preventDefault();

	return false;
}

/*
 * Does all the error checking for the form.
 *
 * return   True if an error was found; False if no errors were found
 */
function formHasErrors() {
    let errorFlag = false

    let requiredFields = "name";

    for(let i=0; i<requiredFields.length; i++) {
		let textField = document.getElementById(requiredFields[i])

        if(!formFieldHasInput(textField)) {
            document.getElementById(requiredFields[i] + "_error").style.display = "block";

                if(!errorFlag) {
                    textField.focus();
                    textField.select()
                }

                // Raise error flag
                errorFlag = true;
        }

	let emailRegex = new RegExp(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm);
    let email = document.getElementById("email").value;

    if(email != "" && !emailRegex.test(email)) {
		document.getElementById("email_error").style.display = "block";

		if(!errorFlag) {
			textField.focus();
			textField.select()
		}

		// Raise error flag
		errorFlag = true;
	}

    }
}

/*
 * Hides all of the error elements.
 */
function hideErrors() {
	// Get an array of error elements
	let nameError = document.getElementById("name_error");
    let emailError = document.getElementById("email_error");

	nameError.style.display = "none";
    emailError.style.display = "none";

	}

/*
 * Determines if a text field element has input 
 *
 * param fieldElement A text field input element object
 * return True if the field contains input; False if nothing entered
 */
function formFieldHasInput(fieldElement) {
	if(fieldElement.value == null || trim(fieldElement.value) == "") {
		// Invalid entry
		return false;
	}
	// Valid entry
	return true;
}

/*
 * Handles the load event of the document.
 */
function load() {
    document.getElementById("submit").addEventListener("submit", validate);
    document.getElementById("clear").reset();
    document.getElementById("clear").addEventListener("clear", resetForm);

}

document.addEventListener("DOMContentLoaded", load);