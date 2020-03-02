import React, { useRef, useLayoutEffect } from 'react';

type Props = {
    collapsed: boolean;
    children: React.ReactChild | React.ReactChild[];
}

// function collapse(el: HTMLElement) {
//     // get the height of the element's inner content, regardless of its actual size
//     const sectionHeight = el.scrollHeight;

//     // temporarily disable all css transitions
//     const elementTransition = el.style.transition;
//     el.style.transition = '';

//     // on the next frame (as soon as the previous style change has taken effect),
//     // explicitly set the element's height to its current pixel height, so we 
//     // aren't transitioning out of 'auto'
//     requestAnimationFrame(() => {
//         el.style.height = sectionHeight + 'px';
//         el.style.transition = elementTransition;

//         // on the next frame (as soon as the previous style change has taken effect),
//         // have the element transition to height: 0
//         requestAnimationFrame(function() {
//             el.style.height = 0 + 'px';
//         });
//     });
// }

// function expand(el: HTMLElement) {
//     // get the height of the element's inner content, regardless of its actual size
//     const sectionHeight = el.scrollHeight;
    
//     // have the element transition to the height of its inner content
//     el.style.height = sectionHeight + 'px';

//     // when the next css transition finishes (which should be the one we just triggered)
//     el.addEventListener('transitionend', function f() {
//         // remove this event listener so it only gets triggered once
//         el.removeEventListener('transitionend', f);
        
//         // remove "height" from the element's inline styles, so it can return to its initial value
//         el.style.height = null as any;
//     });
// }

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
