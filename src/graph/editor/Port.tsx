import React from 'react';
import { translate, PORT_LABEL_OFFSET_X } from "./dimensions";
import styles from './GraphEditor.module.scss';
import cs from 'classnames';

type Props = {
    x: number;
    y: number;
    label: string;
    portOut: boolean;
}

export default function Port(props: Props) {
    const portOut = props.portOut;
    const labelX = portOut ? PORT_LABEL_OFFSET_X : -PORT_LABEL_OFFSET_X;
    return (
        <g transform={translate(props.x, props.y)}>
            <circle className={styles.portHandle} r={7}/>
            <text className={cs(styles.portLabel, { out: portOut })} x={labelX} y={0}>
                {props.label}
            </text>
        </g>
    );
}
