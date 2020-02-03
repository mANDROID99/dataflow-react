import React from 'react';
import { FieldInputProps } from "../types/graphInputTypes";

export default function CheckFieldInput(props: FieldInputProps<boolean>) {
    return (
        <input
            type="checkbox"
            checked={props.value} onChange={(e) => {
                props.onChanged(e.target.checked);
            }}
        />
    );
}
