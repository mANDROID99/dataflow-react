import React from 'react';
import { useGraphContext } from '../../graphEditorContext';

type Props = {

}

export default function SideBar(props: Props) {
    const { graphConfig } = useGraphContext();


    return (
        <div className="ngraph-sidebar">

        </div>
    );
}


