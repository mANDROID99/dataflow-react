
export type ContextMenuItem = {
    label: string;
    action: () => void;
}

export type ContextMenu = {
    id: string;
    title: string;
    x: number;
    y: number;
    items: ContextMenuItem[];
} 
