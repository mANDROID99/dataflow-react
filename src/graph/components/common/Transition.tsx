import React, { useState, useEffect } from 'react';

type Props = {
    show: boolean;
    render: (show: boolean, onAnimationEnd: () => void) => React.ReactElement;
}

export default function Transition({ show, render }: Props): React.ReactElement | null {
    const [visible, setVisible] = useState(show);

    function onAnimationEnd(): void {
        if (!show) setVisible(false);
    }

    useEffect(() => {
        if (show) setVisible(true);
    }, [show]);

    return visible ? render(show, onAnimationEnd) : null;
}
