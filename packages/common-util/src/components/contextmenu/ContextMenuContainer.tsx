import React, { useState, useEffect, useContext } from 'react';
import { MenuContext } from './menuContext';
import ContextMenuComponent from './ContextMenu';

function ContextMenuContainer() {
    const menuManager = useContext(MenuContext);
    const [menu, setMenu] = useState(() => menuManager?.getContextMenu());
    
    useEffect(() => {
        if (!menuManager) return;

        return menuManager.subscribe((menu) => {
            setMenu(menu);
        })
    }, [menuManager]);

    return menu ? (
        <ContextMenuComponent onHide={() => menuManager!.hide()} menu={menu}/>
     ) : null;
}

export default ContextMenuContainer;
