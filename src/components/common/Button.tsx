import React from 'react';
import clsx from 'clsx';

type Props = {
    variant: string;
    label: React.ReactChild;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
}

export default function Button({ variant, label, className, disabled, onClick }: Props) {
    return (
        <button
            className={clsx('ngr-btn', className, variant, { disabled })}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
}
