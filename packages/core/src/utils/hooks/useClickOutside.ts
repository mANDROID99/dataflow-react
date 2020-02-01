import { useEffect } from 'react';

export function useClickOutside(ref: React.RefObject<HTMLElement>, onClickOutside?: () => void) {
    useEffect(() => {
        if (!onClickOutside) {
            return;
        }

        const handleMouseDown = (e: MouseEvent) => {
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

        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        }
    }, [ref, onClickOutside]);
}
