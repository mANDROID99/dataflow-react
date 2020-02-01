import './fa.ts';
import './styles/main.scss';

// types
export * from './types/graphConfigTypes';
export * from './types/graphTemplateTypes';
export * from './types/graphTypes';
export * from './types/graphFieldInputTypes';
export * from './types/processorTypes';

// processor
export { computeGraphNodeContexts } from './processor/computeGraphNodeContexts';
export { createGraphNodeProcessors, runProcessors } from './processor/createGraphNodeProcessors';

// editor
import GraphEditor from './editor/components/GraphEditor';
export { GraphEditor };

// inputs
export { inputs } from './inputs/inputs';
export { forms } from './forms/forms';

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

// redux
export { reducer } from './store/reducer';
