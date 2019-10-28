import React from 'react';
import { GraphFieldInputProps } from '../types/graphInputTypes';

export default function TextInput(props: GraphFieldInputProps<string>) {
    return (
        <input
            className="text-input"
            value={props.value || ''}
            onChange={(e) => props.onChanged(e.target.value)}
        />
    );
}
