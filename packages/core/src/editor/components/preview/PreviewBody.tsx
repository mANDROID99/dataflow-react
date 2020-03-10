import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Button from "../../../common/Button";
import Transition from "../../../common/Transition";
import { selectAutoUpdate, selectGraph } from "../../../store/selectors";
import { Graph } from "../../../types/graphTypes";
import { StoreState } from "../../../types/storeTypes";

type Props = {
    renderPreview: (graph: Graph) => React.ReactNode | null;
}

export default function PreviewBody({ renderPreview }: Props) {
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
        <div className="ngraph-preview-body">
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
