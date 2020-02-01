import React, { useEffect, useRef } from 'react';
import { useForceUpdate } from '../../utils/hooks/useForceUpdate';

type EditorProps = {
    value: string | undefined;
    onChange: (value: string) => void;
    onCancel: () => void;
}

function toString(value: string | undefined) {
    return value == null ? '' : value;
}

function SimpleTableValueEditor({ value, onChange, onCancel }: EditorProps) {
    const [,forceUpdate] = useForceUpdate();
    const inputValue = useRef(toString(value));
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        ref.current!.focus();
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();

            } else if (event.key === 'Enter') {
                onChange(inputValue.current);
            }
        }

        const onMouseDown = (event: MouseEvent) => {
            if (event.target !== ref.current) {
                onChange(inputValue.current);
            }
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('mousedown', onMouseDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mousedown', onMouseDown);
        }
    }, [onChange, onCancel]);

    useEffect(() => {
        inputValue.current = toString(value);
        forceUpdate();
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        inputValue.current = e.target.value;
        forceUpdate();
    }

    return (
        <input
            className="ngraph-table-value-editor"
            ref={ref}
            value={inputValue.current}
            onChange={handleChange}
        />
    );
}

export default SimpleTableValueEditor;
