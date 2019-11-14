import React, { useCallback } from 'react';

type Props = {
    onHide: () => void;
}

export default function Overlay({ onHide }: Props): React.ReactElement {
    const onClicked = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onHide();
    }, [onHide]);

    return <div className="fixed inset-0" onClick={onClicked}/>
}
