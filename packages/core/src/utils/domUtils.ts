
export function isDeepAncestor(e: HTMLElement | null, target: HTMLElement) {
    while (e != null) {
        if (e === target) {
            return true;
            
        } else {
            e = e.parentElement;
        }
    }

    return false;
}
