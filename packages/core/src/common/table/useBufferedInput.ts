import { useEffect, useState } from 'react';

export function useBufferedInput<T>(ref: React.RefObject<any>, value: T, onSubmit: (value: T) => void, onCancel: () => void): [T, (value: T) => void] {
    const [inputValue, setInput] = useState(value);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();

            } else if (event.key === 'Enter') {
                onSubmit(inputValue);
            }
        }

        const onMouseDown = (event: MouseEvent) => {
            if (event.target !== ref.current) {
                onSubmit(inputValue);
            }
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('mousedown', onMouseDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mousedown', onMouseDown);
        }
    });

    useEffect(() => {
        setInput(value);
    }, [value]);

    return [inputValue, setInput];
}
