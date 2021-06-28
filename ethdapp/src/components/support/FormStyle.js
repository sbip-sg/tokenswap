import React, { useState } from "react";

function FormStyle(initialFValues, validateOnChange = false, validate) {
    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});

    const handleInputChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values, [name]: value
        });
        if (validateOnChange) {
            validate({ [name]: value });
        }
    }

    return {
        values, setValues, errors, setErrors, handleInputChange
    }
}

export function Form(props) {
    const { children, ...other } = props;
    return (
        <form autoComplete="off" {...other}>
            {props.children}
        </form>
    )
}

export default FormStyle;
