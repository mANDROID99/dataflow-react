import React, { useEffect, useReducer } from 'react';
import { createPortal } from 'react-dom';
import { useGraphContext } from '../editor/graphEditorContext';

type Props = {
    show: boolean;
    children: React.ReactChild;
    onHide?: () => void;
    onExit?: () => void;
}

type ModalState = {
    show: boolean;
    exited: boolean;
}

enum ActionType { SHOW, HIDE, AFTER_ANIMATION }

function init(show: boolean): ModalState {
    return {
        show,
        exited: !show
    };
}

function modalReducer(state: ModalState, action: ActionType): ModalState {
    switch (action) {
        case ActionType.SHOW:
            return state.show ? state : { show: true, exited: false };

        case ActionType.HIDE:
            return state.show ? { show: false, exited: state.exited } : state;

        case ActionType.AFTER_ANIMATION:
            return state.show ? state : { show: false, exited: true };

        default:
            return state;
    }
}

function Modal(props: Props): React.ReactElement | null {
    const [state, dispatch] = useReducer(modalReducer, props.show, init);
    const { modalRoot } = useGraphContext();

    // update the state when the modal is shown or hidden
    useEffect(() => {
        if (props.show) {
            dispatch(ActionType.SHOW);

        } else {
            dispatch(ActionType.HIDE);
        }
    }, [props.show]);

    // render nothing
    if (state.exited) {
        return null;
    }

    // after the modal has fade animation has completed
    const handleAnimationEnd = () => {
        dispatch(ActionType.AFTER_ANIMATION);

        if (!state.show && props.onExit) {
            props.onExit();
        }
    };

    // when the modal overlay is clicked
    const handleHide = () => {
        dispatch(ActionType.HIDE);

        if (state.show && props.onHide) {
            props.onHide();
        }
    };

    return createPortal(
        <div
            className="ngraph-modal-container"
            style={{ animation: `${state.show ? 'fadeIn' : 'fadeOut'} 0.2s` }}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="ngraph-overlay" onClick={handleHide}/>
            {props.children}
        </div>
    , modalRoot);
}

export default Modal;
