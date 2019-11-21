import React, { useState } from "react";
import classNames from "classnames";
import Input from "../common/Input";

type Props = {
    dark?: boolean;
    value: string;
    onChange: (value: string) => void;
}

export default function TextEditable({ value, onChange, dark }: Props) {
    const [editing, setEditing] = useState(false);

    const handleBeginEdit = () => {
        setEditing(true);
    };
    
    const handleInputChange = (value: string) => {
        setEditing(false);
        onChange(value);
    };

    if (editing) {
        return (
            <Input
                className={classNames("text-editable-input", { dark })}
                value={value}
                onChange={handleInputChange}
                focus
            />
        );
    } else {
        return (
            <div
                className="text-editable-label"
                onClick={handleBeginEdit}
                onFocus={handleBeginEdit}
                tabIndex={0}
            >
                { value || '-' }
            </div>
        );
    }
}
