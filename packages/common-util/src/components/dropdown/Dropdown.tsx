import React from 'react';
import { Placement } from '@popperjs/core';

import Transition from '../Transition';
import { MenuConfig } from './dropdownTypes';
import DropdownMenu from './DropdownMenu';

type Props = {
    show: boolean;
    placement?: Placement;
    target: React.RefObject<HTMLElement>;
    menu: () => MenuConfig;
    onHide: () => void;
    onExit?: () => void;
}

function Dropdown(props: Props) {
    return (
        <Transition show={props.show} onExit={props.onExit}>
            {(show, onExit) => (
                <DropdownMenu
                    onHide={props.onHide}
                    placement={props.placement}
                    target={props.target}
                    menu={props.menu()}
                    show={show}
                    onExit={onExit}
                />
            )}
        </Transition>
    );
}

export default Dropdown;
