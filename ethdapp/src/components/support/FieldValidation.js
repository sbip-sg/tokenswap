import validator from "validator";

/*
 * This class contains methods for validating fields using 'validator.js' library methods.
 * The methods return error message if validation failed and false otherwise.
 * Refer to the documentations at https://github.com/validatorjs/validator.js
 */

class FieldValidation {
    /* SHARED METHOD CALLs */
    validateText(text) {
        if (validator.isEmpty(text)) {
            return 'This field is required.';
        }
        return false;
    }
    validateEmail(email) {
        if (validator.isEmpty(email)) {
            return 'This field is required.';
        } else if (!validator.isEmail(email)) {
            return 'Invalid email format.';
        }
        return false;
    }
    validatePassword(password) {
        if (validator.isEmpty(password)) {
            return 'This field is required.';
        } else if (!validator.isLength(password, { min: 8 })) {
            return 'Password should be minimum 8 characters.';
        }
        return false;
    }

    /* SPECIFIC METHOD CALLS */
    validateTransValue(transactionValue) {
        if (validator.isEmpty(transactionValue)) {
            return 'This Field is Required.';
        }
        return false;
    }
    validateTimeout(timeoutDuration) {
        if (validator.isEmpty(timeoutDuration)) {
            return 'This Field is Required.';
        } else if (!validator.isInt(timeoutDuration, { min: 60, max: 10800 })) {
            return 'Timeout Duration must be at least 60 Seconds and not more than 3 Hours.';
        }
        return false;
    }
}

const fieldValidation = new FieldValidation();
export { fieldValidation };
