import React from "react";
import { TextField } from "@material-ui/core";

export default function InputField(props) {
    const { name, type, label, value, error = null, onChange } = props;
    return (
        <TextField variant="outlined" fullWidth style={{ backgroundColor: "#F5E6FF" }} name={name} type={type} label={label} value={value} onChange={onChange} {...(error && { error: true, helperText: error })} />
    )
}
