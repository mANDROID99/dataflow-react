import React from 'react';
import Button from '../Button';
import ListInputItem from './ListInputItem';

type Props<T> = {
    className?: string;
    values: T[];
    getItemKey?: (value: T, i: number) => string | number;
    onAddItem: () => void;
    onRemoveItem: (idx: number) => void;
    onMoveItem: (idx: number, offset: number) => void;
    renderItem: (value: T, index: number) => React.ReactNode;
}

function ListInput<T>(props: Props<T>) {
    return (
        <div className={props.className}>
            {props.values.map((value, idx, arr) => (
                <ListInputItem
                    idx={idx}
                    key={props.getItemKey?.(value, idx) ?? idx}
                    hasPrev={idx > 0}
                    hasNext={idx < arr.length - 1}
                    onMove={props.onMoveItem}
                    onRemove={props.onRemoveItem}
                >
                    {props.renderItem(value, idx)}
                </ListInputItem>
            ))}
            <Button
                variant="secondary"
                onClick={props.onAddItem}
                label="Add"
            />
        </div>
    );
}

export default React.memo(ListInput) as typeof ListInput;
