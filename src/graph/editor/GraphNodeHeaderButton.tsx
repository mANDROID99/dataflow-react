import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from './GraphEditor.module.scss';

import { translate, HEADER_ICON_OUTER_W, HEADER_ICON_INNER_SIZE, HEADER_HEIGHT, HEADER_ICON_OUTER_H } from './dimensions';

type Props = {
    x: number;
    y: number;
    icon: IconProp;
}

export default function GraphNodeHeaderButton(props: Props) {
    return (
        <g transform={translate(props.x, props.y)}>
            <rect
                className={styles.iconOverlay}
                width={HEADER_ICON_OUTER_W} height={HEADER_HEIGHT}
            />
            <foreignObject
                className={styles.wrapIcon}
                x={(HEADER_ICON_OUTER_W - HEADER_ICON_INNER_SIZE) / 2}
                y={(HEADER_ICON_OUTER_H - HEADER_ICON_INNER_SIZE) / 2 - 1}
                width={HEADER_ICON_INNER_SIZE} height={HEADER_ICON_INNER_SIZE}
            >
                <FontAwesomeIcon className={styles.icon} icon={props.icon}/>
            </foreignObject>
        </g>
    )
}

