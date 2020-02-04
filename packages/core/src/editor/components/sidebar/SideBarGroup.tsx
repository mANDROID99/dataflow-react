import React, { useRef, useLayoutEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { GraphNodeConfig } from '../../../types/graphConfigTypes';

export type Group = {
    name: string;
    nodes: GraphNodeConfig<unknown, unknown>[];
}

type Props = {
    group: Group;
}

function collapse(el: HTMLElement) {
    // get the height of the element's inner content, regardless of its actual size
    const sectionHeight = el.scrollHeight;

    // temporarily disable all css transitions
    const elementTransition = el.style.transition;
    el.style.transition = '';

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(() => {
        el.style.height = sectionHeight + 'px';
        el.style.transition = elementTransition;

        // on the next frame (as soon as the previous style change has taken effect),
        // have the element transition to height: 0
        requestAnimationFrame(function() {
            el.style.height = 0 + 'px';
        });
    });
}

function expand(el: HTMLElement) {
    // get the height of the element's inner content, regardless of its actual size
    const sectionHeight = el.scrollHeight;
    
    // have the element transition to the height of its inner content
    el.style.height = sectionHeight + 'px';

    // when the next css transition finishes (which should be the one we just triggered)
    el.addEventListener('transitionend', function f() {
        // remove this event listener so it only gets triggered once
        el.removeEventListener('transitionend', f);
        
        // remove "height" from the element's inline styles, so it can return to its initial value
        el.style.height = null as any;
    });
}

export default function SideBarGroup({ group }: Props) {
    const [expanded, setExpanded] = useState(true);
    const ref = useRef<HTMLDivElement>(null);

    const prevExpanded = useRef(expanded);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (expanded !== prevExpanded.current) {
            prevExpanded.current = expanded;

            if (expanded) {
                expand(el);
            } else {
                collapse(el);
            }
        }
    });

    const handleToggleExpanded = () => {
        setExpanded(!expanded);
    }

    return (
        <div className="ngraph-nodelist-group">
            <div className="ngraph-nodelist-group-header" onClick={handleToggleExpanded}>
                <div className="ngraph-nodelist-header-expander">
                    <FontAwesomeIcon icon={expanded ? "chevron-down" : "chevron-up"}/>
                </div>
                <div className="ngraph-nodelist-header-text">
                    {group.name}
                </div>
            </div>
            <div ref={ref} className={cn("ngraph-nodelist-group-items")}>
                {group.nodes.map((nodeConfig, index) => (
                    <div key={index} className="ngraph-nodelist-item">
                        {nodeConfig.title}
                    </div>
                ))}
            </div>
        </div>
    )
}
