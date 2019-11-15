import React, { useState, useEffect } from "react";

type Props = {
    value: string;
    onValueChanged: (value: string) => void;
}

function InputEditor(props: Props): React.ReactElement {
    const [value, setValue] = useState(props.value);

    const onChange = (e: React.ChangeEvent<any>): void => {
        setValue(e.target.value);
    };

    const onBlur = (): void => {
        props.onValueChanged(value);
    };

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (
        <input
            className="datagrid-editor"
            value={'' + value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}

export default InputEditor;
