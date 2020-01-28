import React from 'react';
import { TableAction, setAllRowsSelected } from './simpleTableReducer';

type Props = {
    checked: boolean;
    dispatch: React.Dispatch<TableAction>;
}

function SimpleTableSelectAllToggle(props: Props) {

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatch(setAllRowsSelected(event.target.checked));
    };

    return (
        <div className="ngraph-table-header ngraph-table-row-toggle">
            <input
                type="checkbox"
                checked={props.checked}
                onChange={handleToggle}
            />
        </div>
    );
}

export default React.memo(SimpleTableSelectAllToggle);
