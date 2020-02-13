import './fa.ts';
import './styles/main.scss';

// types
export * from './types/graphConfigTypes';
export * from './types/graphTemplateTypes';
export * from './types/graphTypes';
export * from './types/graphInputTypes';
export * from './types/processorTypes';

// processor
export { computeContexts } from './processor/computeContexts';
export { createProcessorsFromGraph, runProcessors, invokeProcessors } from './processor/createProcessors';

// editor
import GraphEditor from './editor/components/GraphEditor';
export { GraphEditor };

// inputs
export { inputs } from './inputs/inputs';

// expressions
import * as expressions from './utils/expressionUtils';
export { expressions };

// simple-table
import SimpleTable from './common/table/SimpleTable';
export { SimpleTable };
export * from './common/table/simpleTableTypes';

// re-export jexl so the user can modify it with additional transforms etc.
import jexl from 'jexl';
export { jexl };
