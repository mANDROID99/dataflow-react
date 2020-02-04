import React from 'react';
import { InputProps } from "../types/graphInputTypes";

export default function CheckFieldInput(props: InputProps<boolean>) {
    return (
        <input
            type="checkbox"
            checked={props.value} onChange={(e) => {
                props.onChanged(e.target.checked);
            }}
        />
    );
}
