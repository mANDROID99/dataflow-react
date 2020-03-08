import React, { useEffect, useState, useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";

import { StoreState } from "../../../types/storeTypes";
import { Graph } from "../../../types/graphTypes";

import { selectGraph, selectAutoUpdate } from "../../../store/selectors";
import Transition from "../../../common/Transition";
import Button from "../../../common/Button";

type Props = {
    renderPreview: (graph: Graph) => React.ReactNode | null;
}

export default function PreviewContent({ renderPreview }: Props) {
    const { graph, autoUpdate } = useSelector((state: StoreState) => ({
        graph: selectGraph(state),
        autoUpdate: selectAutoUpdate(state)
    }), shallowEqual);

    const [bufferedGraph, setBufferedGraph] = useState<Graph>(graph);
    const isGraphUpdated = !autoUpdate && graph !== bufferedGraph;

    useEffect(() => {
        if (autoUpdate) {
            setBufferedGraph(graph);
        }
    }, [graph, autoUpdate]);

    const handleTriggerUpdate = () => {
        setBufferedGraph(graph);
    };

    return (
        <div className="ngraph-preview-content">
            {useMemo(() => renderPreview(bufferedGraph), [bufferedGraph, renderPreview])}
            <Transition show={isGraphUpdated}>
                {(show, onExit) => (
                    <div
                        className="ngraph-preview-update-overlay"
                        style={{ animation: `${show ? 'fadeIn' : 'fadeOut'} 0.2s` }}
                        onAnimationEnd={onExit}
                    >
                        <Button onClick={show ? handleTriggerUpdate : undefined}>
                            Update Preview
                        </Button>
                    </div>
                )}
            </Transition>
        </div>
    );
}
