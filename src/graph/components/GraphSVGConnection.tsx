import React from 'react';

type Props = {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
}

function GraphSVGConnection(props: Props) {
    const d = `M${props.sx},${props.sy}L${props.ex},${props.ey}`;
    return <path className="graph-connection" d={d}/>
}

export default React.memo(GraphSVGConnection);
