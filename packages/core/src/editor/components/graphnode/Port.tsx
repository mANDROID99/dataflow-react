import React from 'react';
import { DEFAULT_PORT_COLOR } from '../../../utils/graph/portUtils';

const RADIUS_OUTER = 8;
const RADIUS = 3;

type Props = {
    colors: string[];
}

export default function Port(props: Props) {
    let colors = props.colors;
    
    if (colors.length === 0) {
        colors = [DEFAULT_PORT_COLOR];
    }

    const n = colors.length;
    const r = 2 * Math.PI / n;

    function drawSegment(color: string, i: number) {
        const cx = RADIUS_OUTER;
        const cy = RADIUS_OUTER;

        if (i === 0) {
            return <circle key={i} cx={cx} cy={cy} fill={color} r={RADIUS}/>;

        } else {
            const sx = cx;
            const sy = cy - RADIUS;

            const rot = r * (n - i);
            const ex = cx + RADIUS * Math.sin(rot);
            const ey = cy - RADIUS * Math.cos(rot);
            const sweepFlag = rot > Math.PI ? 1 : 0;

            const d = (
                `M${sx} ${sy} ` +
                `L${sx} ${sy} ` +
                `A ${RADIUS} ${RADIUS} 0 ${sweepFlag} 1 ${ex} ${ey} ` +
                `L${cx} ${cy}`
            );

            return <path key={i} d={d} fill={color} />;
        }
    }

    return (
        <svg
            className="ngraph-node-port-handle"
            width={RADIUS_OUTER * 2}
            height={RADIUS_OUTER * 2}
        >
            <circle className="ngraph-node-port-handle-outer" cx={RADIUS_OUTER} cy={RADIUS_OUTER} r={RADIUS_OUTER - 2}/>
            {colors.map(drawSegment)}    
        </svg>
    );
}

