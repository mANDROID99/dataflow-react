import React, { useRef, useCallback } from "react";

type Props = {
    onHide: () => void;
}

export default function Overlay({ onHide }: Props): React.ReactElement {
    const overlayRef = useRef<HTMLDivElement>(null);

    const onClick = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        if (event.target === overlayRef.current) {
            onHide();
        }
    }, [onHide]);

    return (
        <div ref={overlayRef} className="overlay" onClick={onClick}/>
    );
}
