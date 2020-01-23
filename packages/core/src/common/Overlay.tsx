import React, { useRef, useCallback } from "react";

type Props = {
    onHide: () => void;
    children?: React.ReactChild;
}

export default function Overlay({ onHide, children }: Props): React.ReactElement {
    const overlayRef = useRef<HTMLDivElement>(null);

    const onClick = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        if (event.target === overlayRef.current) {
            onHide();
        }
    }, [onHide]);

    return (
        <div ref={overlayRef} className="ngraph-overlay" onClick={onClick}>
            {children}
        </div>
    );
}
