import React, { useContext } from 'react';
import { ContextMenuManager } from './ContextMenuManager';

export const MenuContext = React.createContext<ContextMenuManager | null>(null);

export function useContextMenu() {
    return useContext(MenuContext);
}
