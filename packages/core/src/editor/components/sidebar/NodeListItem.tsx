import React from 'react';
import { useDrag } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

type Props = {
    id: string;
    label: string;
}

export default function NodeListItem({ id, label }: Props) {
    const [{ isDragging }, dragRef] = useDrag({
        item: {
            id: id,
            type: 'node'
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    });

    return (
        <div ref={dragRef} className={cn("ngraph-nodelist-item", { dragging: isDragging })}>
            <div className="ngraph-flex-grow ngraph-text-ellipsis ngraph-mr-2">
                {label}
            </div>
            <div className="ngraph-nodelist-item-dragsource">
                <FontAwesomeIcon icon="plus"/>
            </div>
        </div>
    );
}
