import React, { useRef, useLayoutEffect } from 'react';

type Props = {
    collapsed: boolean;
    children: React.ReactChild | React.ReactChild[];
}

export default function Collapse({ collapsed, children }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const inited = useRef(false);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        
        if (!inited.current) {
            inited.current = true;
            if (collapsed) {
                el.classList.add('collapsed');
            }
            return;
        }
        
        if (collapsed) {
            const scrollHeight = el.scrollHeight;
            el.style.height = scrollHeight + 'px';
            el.classList.add('collapsing');

            const afterTransition = () => {
                el.removeEventListener('transitionend', afterTransition);
                el.classList.remove('collapsing');
                el.classList.add('collapsed');
            };

            requestAnimationFrame(() => {
                el.style.height = null as any;
                el.addEventListener('transitionend', afterTransition);
            });

            return () => {
                el.removeEventListener('transitionend', afterTransition);
            };

        } else {
            el.classList.remove('collapsed');
            el.classList.add('collapsing');

            const afterTransition = () => {
                el.removeEventListener('transitionend', afterTransition);
                el.classList.remove('collapsing');
                el.style.height = null as any;
            };

            requestAnimationFrame(() => {
                const scrollHeight = el.scrollHeight;
                el.style.height = scrollHeight + 'px';
                el.addEventListener('transitionend', afterTransition);
            });

            return () => {
                el.removeEventListener('transitionend', afterTransition);
            };
        }
    }, [collapsed]);

    return (
        <div ref={ref} className="ngraph-collapse">
            {children}
        </div>
    );
}
