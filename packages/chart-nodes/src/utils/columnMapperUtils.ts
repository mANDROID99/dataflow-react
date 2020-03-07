import { ColumnMapperInputValue, ColumnMapperType } from "../types/inputTypes";
import { compileExpression } from "./expressionUtils";

/**
 * converts a column mapper input to an expression string
 * @param input 
 * @param target 
 */
export function columnMapperToExpression(input: ColumnMapperInputValue | undefined, target?: string): string | undefined {
    if (input != null) {
        if (typeof input === 'string') {
            if (!input) return;
            
            const tgt = target || 'value';
            return '= ' + tgt + '["' + input + '"]';

        } else if (input.type === ColumnMapperType.EXPRESSION) {
            return input.value ? input.value : undefined;
        }
    }
}

export function getColumnMapperType(input: ColumnMapperInputValue) {
    return typeof input === 'string' ? ColumnMapperType.COLUMN : input.type;
}

/**
 * compile a column mapper to an evaluatable function
 * @param input 
 * @param target 
 */
export function compileColumnMapper(input: ColumnMapperInputValue, target?: string): (ctx: { [key: string]: unknown }) => unknown {
    const expr: string | undefined = columnMapperToExpression(input, target);
    return compileExpression(expr);
}
