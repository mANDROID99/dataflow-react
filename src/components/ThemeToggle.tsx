import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import cn from 'classnames';
import { selectTheme } from "../redux/editorSelectors";
import { toggleTheme } from '../redux/editorActions';

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    }

    const toggled = theme === 'dark';

    return (
        <div className={cn("ngraph-theme-toggle", { toggled })}>
            <div className="ngraph-theme-toggle-label">
                {theme}
            </div>
            <div className="ngraph-theme-toggle-btn" onClick={handleToggleTheme}>
                <div className="ngraph-theme-toggle-switch"/>
            </div>
        </div>
    );
}

