import React, { useState, useCallback } from 'react';
import { GraphFieldEditorProps } from "graph/types/graphConfigTypes";

function toString(value: unknown): string {
    if (value == null) {
        return '';
    } else {
        return '' + value;
    }
}

export default function TextEditor<Ctx>(props: GraphFieldEditorProps<Ctx, string>): React.ReactElement {
    const [value, setValue] = useState(toString(props.value));

    function onBlur(): void {
        props.onChanged(value);
    }

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    return (
        <input
            className="text-input"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}
