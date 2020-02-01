import React, { useLayoutEffect, useRef } from 'react';
import { createPopper, Options, Instance } from '@popperjs/core';
import Transition from './Transition';
import { useClickOutside } from '../utils/hooks/useClickOutside';

type Props = {
    show: boolean;
    target: React.RefObject<HTMLElement>;
    options?: Partial<Options>;
    onHide: () => void;
    onExit?: () => void;
    children: React.ReactChild | (() => React.ReactElement);
}

function TooltipInner({ show, target, options, onHide, onExit, children }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const popperRef = useRef<Instance>();

    useLayoutEffect(() => {
        const popper = createPopper(target.current!, ref.current!, options);
        return () => {
            popper.destroy();
        }
    }, []);

    const optionsRef = useRef(options);
    useLayoutEffect(() => {
        if (popperRef.current && options && options !== optionsRef.current) {
            optionsRef.current = options;
            popperRef.current.setOptions(options);
        }
    });

    useClickOutside(ref, onHide);

    function renderContent() {
        if (typeof children === 'function') {
            return children();
        } else {
            return React.Children.only(children);
        }
    }

    return (
        <div
            ref={ref}
            className="ngraph-tt"
            onAnimationEnd={onExit}
            style={{
                animation: (show ? 'fadeIn' : 'fadeOut') + ' 0.25s'
            }}
        >
            <div className="ngraph-tt-arrow" data-popper-arrow/>
            {renderContent()}
        </div>
    );
}

function Tooltip(props: Props) {
    return (
        <Transition show={props.show} onExit={props.onExit}>
            {(show, onExit) => (
                <TooltipInner
                    {...props}
                    show={show}
                    onExit={onExit}
                />
            )}
        </Transition>
    );
}

export default Tooltip;
