import '@simonwep/pickr/dist/themes/nano.min.css';
import './styles/main.scss';
import './fa.ts';

// types
export * from './types/graphConfigTypes';
export * from './types/graphTemplateTypes';
export * from './types/graphTypes';
export * from './types/graphInputTypes';
export * from './types/nodeProcessorTypes';

// processor
export { createProcessorsFromGraph, runAllProcessors, invokeAllProcessors } from './processor/createProcessors';

// editor
import GraphEditor from './editor/components/GraphEditor';
export { GraphEditor };

// inputs
export { inputs } from './inputs/inputs';

// simple-table
import SimpleTable from './common/table/SimpleTable';
export { SimpleTable };
export * from './common/table/simpleTableTypes';

export { nodes, NodeType } from './nodes/nodes';
export { BaseNodeProcessor } from './nodes/BaseNodeProcessor';

import CommonSelectInput from './common/CommonSelectInput';
export { CommonSelectInput };

import CommonTextInput from './common/CommonTextInput';
export { CommonTextInput };
