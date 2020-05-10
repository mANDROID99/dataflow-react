import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { withTransition, TransitionComponentProps } from './Transition';
import clsx from 'clsx';

const PAD = 5;

export type ContextMenuItem = {
    label: string;
    disabled?: boolean;
    action: () => void;
}

export type ContextMenuParams = {
    title: string;
    x: number;
    y: number;
    items: ContextMenuItem[];
    onHide: () => void;
}

type Props = {
    show: boolean;
    onExit: () => void;
}

function ContextMenu({ value, show, onExit }: TransitionComponentProps<ContextMenuParams>) {
    const { x, y, title, items, onHide } = value;
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = ref.current!;
        const rect = el.getBoundingClientRect();
        
        const docWidth = document.body.clientWidth;
        const left = Math.min(x, docWidth - PAD - rect.width);
        el.style.left = left + 'px';
        
        const docHeight = document.body.clientHeight;
        const top = Math.min(y, docHeight - PAD - rect.height);
        el.style.top = top + 'px';
    }, [x, y]);

    useEffect(() => {
        document.addEventListener('mousedown', onHide);
        return () => {
            document.removeEventListener('mousedown', onHide);
        }
    }, [onHide]);

    return (
        <div
            ref={ref}
            className="ngraph-context-menu"
            onAnimationEnd={onExit}
            style={{
                animation: `${show ? 'slideIn' : 'slideOut'} 0.2s`
            }}
        >
            <div className="ngraph-context-menu-title">
                {title}
            </div>
            {items.map((item, i) => (
                <div
                    key={i}
                    className={clsx("ngraph-context-menu-item", { disabled: !!item.disabled })}
                    onClick={item.disabled ? undefined : item.action}
                >
                    {item.label}
                </div>
            ))}
        </div>
    )
}

export default withTransition(ContextMenu);