import { GraphNodeConfig, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Indexer } from "../../utils/chart/Indexer";

const PORT_OUT = 'indexer';

class IndexerNodeProcessor extends BaseNodeProcessor {
    start() {
        this.emitResult(PORT_OUT, new Indexer());
    }

    process(): void {
        /* do nothing */
    }
}

export const INDEXER_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Indexer',
    description: 'Indexer',
    menuGroup: 'Chart',
    ports: {
        in: {},
        out: {
            [PORT_OUT]: {
                type: 'indexer'
            }
        }
    },
    fields: {},
    createProcessor() {
        return new IndexerNodeProcessor();
    }
}
