import { useEffect } from 'react';

export function useClickOutside(ref: React.RefObject<HTMLElement>, onClickOutside: () => void) {
    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            let target = e.target as HTMLElement | null;

            while (target != null) {
                if (target === ref.current) {
                    return;
                    
                } else {
                    target = target.parentElement;
                }
            }

            onClickOutside();
        } 

        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [ref, onClickOutside]);
}
