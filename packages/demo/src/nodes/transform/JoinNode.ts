import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, NodeProcessor, expressions } from "@react-ngraph/core";

import { Row, JoinType, EMPTY_ROWS, RowsValue, createRowsValue } from "../../types/valueTypes";
import { ChartContext, ChartParams } from "../../chartContext";
import { asString } from "../../utils/converters";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { NodeType } from "../nodes";

type KeyExtractor = (row: Row, i: number) => string;

function merge(left: Row, right: Row): Row {
    return Object.assign({}, left, right);
}

function rowsToLookup(rows: Row[], keyFn: KeyExtractor) {
    const rowsByKey = new Map<string, Row>();

    for (let i = 0, n = rows.length; i < n; i++) {
        const row = rows[i];
        const key = keyFn(row, i);
        rowsByKey.set(key, row);
    }

    return rowsByKey;
}

function joinInner(left: Row[], right: Row[], keyLeftFn: KeyExtractor, keyRightFn: KeyExtractor): Row[] {
    const rowsByKey = rowsToLookup(right, keyRightFn);
    const result: Row[] = [];

    for (let i = 0, n = left.length; i < n; i++) {
        const row = left[i];
        const key = keyLeftFn(row, i);

        if (rowsByKey.has(key)) {
            const rowRight = rowsByKey.get(key)!;
            result.push(merge(row, rowRight));
        }
    }

    return result;
}

function joinLeft(left: Row[], right: Row[], keyLeftFn: KeyExtractor, keyRightFn: KeyExtractor): Row[] {
    const rowsByKey = rowsToLookup(right, keyRightFn);
    const result: Row[] = new Array<Row>(left.length);

    for (let i = 0, n = left.length; i < n; i++) {
        const row = left[i];
        const key = keyLeftFn(row, i);

        if (rowsByKey.has(key)) {
            const rowRight = rowsByKey.get(key)!;
            result[i] = merge(row, rowRight);

        } else {
            result[i] = row;
        }
    }

    return result;
}

function joinFull(left: Row[], right: Row[], keyLeftFn: KeyExtractor, keyRightFn: KeyExtractor): Row[] {
    const rowsByKey = rowsToLookup(right, keyRightFn);
    const result: Row[] = [];

    for (let i = 0, n = left.length; i < n; i++) {
        const row = left[i];
        const key = keyLeftFn(row, i);

        if (rowsByKey.has(key)) {
            const rowRight = rowsByKey.get(key)!;
            rowsByKey.delete(key);
            result.push(merge(row, rowRight));

        } else {
            result.push(row);
        }
    }

    for (const row of rowsByKey.values()) {
        result.push(row);
    }

    return result;
}

const PORT_LEFT = 'left';
const PORT_RIGHT = 'right';
const PORT_ROWS = 'rows';

class JoinNodeProcessor implements NodeProcessor {
    private sub?: (value: unknown) => void;
    private left?: Row[];
    private right?: Row[];

    constructor(
        private readonly joinType: JoinType,
        private readonly keyLeftMapper: expressions.Mapper,
        private readonly keyRightMapper: expressions.Mapper,
        private readonly context: { [key: string]: unknown }
    ) {
        this.extractKeyLeft = this.extractKeyLeft.bind(this);
        this.extractKeyRight = this.extractKeyRight.bind(this);
    }

    get type(): string {
        return NodeType.JOIN;
    }
    
    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_LEFT) {
            processor.subscribe(portOut, this.onNextLeft.bind(this));

        } else if (portIn === PORT_RIGHT) {
            processor.subscribe(portOut, this.onNextRight.bind(this));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ROWS) {
            this.sub = sub;
        }
    }

    private onNextLeft(value: unknown) {
        this.left = (value as RowsValue).rows;
        this.update();
    }

    private onNextRight(value: unknown) {
        this.right = (value as RowsValue).rows;
        this.update();
    }

    private update() {
        if (!this.sub || !this.left || !this.right) {
            return;
        }

        let rows: Row[];
        switch (this.joinType) {
            case JoinType.INNER:
                rows = joinInner(this.left, this.right, this.extractKeyLeft, this.extractKeyRight);
                break;

            case JoinType.LEFT:
                rows = joinLeft(this.left, this.right, this.extractKeyLeft, this.extractKeyRight);
                break;
            
            case JoinType.FULL:
                rows = joinFull(this.left, this.right, this.extractKeyLeft, this.extractKeyRight);
                break;
        }

        this.sub(createRowsValue(rows));
    }

    private extractKeyLeft(row: Row, index: number): string {
        const ctx = rowToEvalContext(row, index, this.context);
        return asString(this.keyLeftMapper(ctx));
    }

    private extractKeyRight(row: Row, index: number): string {
        const ctx = rowToEvalContext(row, index, this.context);
        return asString(this.keyRightMapper(ctx));
    }
}

export const JOIN_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Join',
    menuGroup: 'Transform',
    description: 'Joins two tables together based on a key.',
    ports: {
        in: {
            [PORT_LEFT]: {
                type: 'row[]'
            },
            [PORT_RIGHT]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        joinType: {
            label: 'Join Type',
            type: FieldInputType.SELECT,
            initialValue: JoinType.LEFT,
            params: {
                options: Object.values(JoinType)
            }
        },
        joinKeyLeft: {
            label: 'Map Key Left',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ parents }) => {
                const columns: string[] = parents.left[0]?.columns ?? [];
                return {
                    columns,
                    target: 'row'
                };
            }
        },
        joinKeyRight: {
            label: 'Map Key Right',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ parents }) => {
                const columns: string[] = parents.right[0]?.columns ?? [];
                return {
                    columns,
                    target: 'row'
                };
            }
        }
    },
    createProcessor(node, params) {
        const joinType = node.fields.joinType as JoinType;
        
        const joinKeyLeftExpr = node.fields.joinKeyLeft as ColumnMapperInputValue;
        const leftKeyMapper = expressions.compileColumnMapper(joinKeyLeftExpr, 'row');
        
        const joinKeyRightExpr = node.fields.joinKeyRight as ColumnMapperInputValue;
        const rightKeyMapper = expressions.compileColumnMapper(joinKeyRightExpr, 'row');

        return new JoinNodeProcessor(joinType, leftKeyMapper, rightKeyMapper, params.variables);
    }
};
