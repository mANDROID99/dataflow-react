import React, { useState, useEffect } from 'react';

type Props = {
    show: boolean;
    children: React.ReactNode;
}

export default function SlideInOut({ show, children }: Props): React.ReactElement | null {
    const [visible, setVisible] = useState(show);

    function onAnimationEnd(): void {
        if (!show) setVisible(false);
    }

    useEffect(() => {
        if (show) setVisible(true);
    }, [show]);

    return visible ? (
        <div className="relative w-full h-full" style={{ animation: `${show ? 'slideIn' : 'slideOut'} 0.5s`}} onAnimationEnd={onAnimationEnd}>
            { children }
        </div>
    ) : null;
}
