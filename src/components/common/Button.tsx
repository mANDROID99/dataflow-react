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
    const cn = clsx('ngraph-btn', className, variant, { disabled });
    return (
        <button
            className={cn}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
}
