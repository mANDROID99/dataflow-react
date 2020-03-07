import { GraphNodeConfig, InputType as CoreInputType, BaseNodeProcessor } from "@react-ngraph/core";

import { Row, JoinType } from "../../types/valueTypes";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { asString } from "../../utils/conversions";
import { rowToEvalContext, Mapper } from "../../utils/expressionUtils";
import { InputType, ColumnMapperInputValue } from "../../types/inputTypes";
import { compileColumnMapper } from "../../utils/columnMapperUtils";

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

type Config = {
    joinType: JoinType;
    mapKeyLeft: Mapper;
    mapKeyRight: Mapper;
}

class JoinNodeProcessor extends BaseNodeProcessor {
    private left?: Row[];
    private right?: Row[];

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
        this.extractKeyLeft = this.extractKeyLeft.bind(this);
        this.extractKeyRight = this.extractKeyRight.bind(this);
    }

    process(portName: string, values: unknown[]) {
        if (portName === PORT_LEFT) {
            this.left = values[0] as Row[];
            this.update();

        } else if (portName === PORT_RIGHT) {
            this.right = values[0] as Row[];
            this.update();
        }
    }

    private update() {
        if (!this.left || !this.right) {
            return;
        }

        let rows: Row[];
        switch (this.config.joinType) {
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

        this.emitResult(PORT_ROWS, rows);
    }

    private extractKeyLeft(row: Row, index: number): string {
        const ctx = rowToEvalContext(row, index, null, this.params.variables);
        return asString(this.config.mapKeyLeft(ctx));
    }

    private extractKeyRight(row: Row, index: number): string {
        const ctx = rowToEvalContext(row, index, null, this.params.variables);
        return asString(this.config.mapKeyRight(ctx));
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
            type: CoreInputType.SELECT,
            initialValue: JoinType.LEFT,
            params: {
                options: Object.values(JoinType)
            }
        },
        joinKeyLeft: {
            label: 'Map Key Left',
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            params: ({ context }) => ({
                columns: context.columns
            })
        },
        joinKeyRight: {
            label: 'Map Key Right',
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            params: ({ context }) => ({
                columns: context.columns  
            })
        }
    },
    createProcessor(node, params) {
        const joinType = node.fields.joinType as JoinType;
        
        const joinKeyLeftExpr = node.fields.joinKeyLeft as ColumnMapperInputValue;
        const mapKeyLeft = compileColumnMapper(joinKeyLeftExpr);
        
        const joinKeyRightExpr = node.fields.joinKeyRight as ColumnMapperInputValue;
        const mapKeyRight = compileColumnMapper(joinKeyRightExpr);

        return new JoinNodeProcessor(params, { joinType, mapKeyLeft, mapKeyRight });
    }
};
