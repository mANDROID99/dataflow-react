import React, { useState, useEffect } from 'react';

type Props = {
    show: boolean;
    onExit?: () => void;
    render: (show: boolean, onAnimationEnd: () => void) => React.ReactElement;
}

export default function Transition({ show, onExit, render }: Props): React.ReactElement | null {
    const [visible, setVisible] = useState(show);

    const onAnimationEnd = (): void => {
        if (!show) {
            setVisible(false);

            if (onExit) {
                onExit();
            }
        }
    };

    useEffect(() => {
        if (show) setVisible(true);
    }, [show]);

    return visible ? render(show, onAnimationEnd) : null;
}
