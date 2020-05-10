import React, { useRef } from 'react';
import clsx from 'clsx';

type Props = {
    className?: string;
    show: boolean;
    onHide?: () => void;
    onExit?: () => void;
    children: React.ReactChild;
}

export default function Overlay({ className, show, children, onHide, onExit }: Props) {
    const ref =  useRef<HTMLDivElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === ref.current && onHide) {
            onHide();
        }
    }

    const handleAnimationEnd = () => {
        if (!show && onExit) onExit();
    }

    return (
        <div
            ref={ref}
            className={clsx("ngraph-overlay", className)}
            onClick={handleClick}
            onAnimationEnd={handleAnimationEnd}
            style={{ animation: `${show ? 'fadeIn' : 'fadeOut'} 0.2s` }}
        >
            {children}
        </div>
    );
};
