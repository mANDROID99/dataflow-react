import './fa.ts';
import './styles/main.scss';

// types
export * from './types/graphConfigTypes';
export * from './types/graphTemplateTypes';
export * from './types/graphTypes';
export * from './types/graphFieldInputTypes';

// processor
export { computeGraphNodeContexts } from './processor/computeGraphNodeContexts';
export { createGraphNodeProcessors, runProcessors } from './processor/createGraphNodeProcessors';
export { GraphNodeProcessor as NodeProcessor } from './processor/GraphNodeProcessor';

// editor
import GraphEditor from './editor/components/GraphEditor';
export { GraphEditor };

// inputs
export { inputs } from './inputs/inputs';
export { forms } from './forms/forms';

// expressions
import * as expressionUtils from './utils/expressionUtils';
export { expressionUtils };

// re-export jexl so the user can modify it with additional transforms etc.
import jexl from 'jexl';
export { jexl };

// redux
export { reducer } from './store/reducer';
