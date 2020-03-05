import React, { useState, useRef, useEffect } from "react";

type Props = {
    className?: string;
    focus?: boolean;
    value: string;
    type?: string;
    onChange: (value: string) => void | string;
}

export default function CommonTextInput({ value, type, onChange, className, focus }: Props) {
    const [inputValue, setInputValue] = useState(value);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const el = inputRef.current;
        if (el && focus) el.focus();
    }, [focus]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);
    
    const handleInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleBlur = () => {
        const updated = onChange(inputValue);
        if (updated != null) {
            setInputValue(updated);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();

            if (e.key === 'Enter') {
                handleBlur();
            } else {
                // escape
                setInputValue(value);
            }
        }
    };

    const cn = ['ngraph-input'];

    if (className) {
        cn.push(className);
    }

    if (inputValue.startsWith('=')) {
        cn.push('code');
    }

    return (
        <input
            className={cn.join(' ')}
            value={inputValue}
            type={type}
            ref={inputRef}
            onChange={handleInputChanged}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
        />
    );
}

