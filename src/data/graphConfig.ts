import { GraphNodeConfig, GraphConfig, GraphNodeRole } from "../types/graphConfigTypes";
import { inputs, InputType } from "../editor/components/input/standardInputs";
import { Column } from "../editor/components/datagrid/dataGridTypes";

export type ChartContext = {
    properties: string[];
}

const ROW_GROUP = Symbol();

enum DataType {
    ROW = 'row',
    ROW_GROUP = 'rowgroup' 
}


type Row = { __type: DataType.ROW, [key: string]: string | undefined };

type RowGroup = { __type: DataType.ROW_GROUP, group: string, rows: Row[] };

type Scalar = string | number | boolean;

export type DataTable = {
    columns: Column[];
    rows: string[][];
}

const grid: GraphNodeConfig = {
    title: 'Grid',
    role: GraphNodeRole.INPUT,
    menuGroup: 'Input',
    fields: [
        { label: 'Data', name: 'data', type: InputType.DATA_GRID }
    ],
    ports: {
        in: [],
        out: [
            { name: 'data', type: 'row[]' }
        ]
    },
    run(input, next) {
        const dataTable = input.data as DataTable;
        const rows: Row[] = dataTable.rows.map(rowValues => {
            const row: Row = { __type: DataType.ROW };
            dataTable.columns.forEach((col, i) => {
                row[col.name] = rowValues[i];
            });
            return row;
        });

        next({
            rows
        });
    }
}

const group: GraphNodeConfig = {
    title: 'Group',
    menuGroup: 'Transform',
    fields: [
        { label: 'Column', name: 'column', type: InputType.TEXT }
    ],
    ports: {
        in: [
            { name: 'data', type: ['row[]', 'rowgroup[]'] }
        ],
        out: [
            { name: 'groups', type: 'rowgroup[]' }
        ]
    },
    run(input, next) {
        const data = input.data as Row[] | RowGroup[];
        const column = input.column as string;
        let groupsLookup = new Map<string, RowGroup>();
        const groups: RowGroup[] = [];

        for (const row of data) {
            if (row.__type === DataType.ROW) {
                const groupName = row[column];
                if (groupName !== undefined) {
                    let group: RowGroup | undefined = groupsLookup.get(groupName);
                    if (!group) {
                        group = {
                            __type: DataType.ROW_GROUP,
                            group: groupName,
                            rows: []
                        };
                        groups.push(group);
                        groupsLookup.set(groupName, group);
                    }
                    group.rows.push(row);
                }

            } else {
                groupsLookup = new Map<string, RowGroup>();
                for (const subRow of row.rows) {
                    const groupName = subRow[column];
                    if (groupName !== undefined) {
                        let group: RowGroup | undefined = groupsLookup.get(groupName);
                        if (!group) {
                            group = {
                                __type: DataType.ROW_GROUP,
                                group: groupName,
                                rows: []
                            };
                            groups.push(group);
                            groupsLookup.set(groupName, group);
                        }
                        group.rows.push(subRow);
                    }
                }
            }
        }

        next({
            groups
        });
    }
};

const sum: GraphNodeConfig = {
    title: 'Sum',
    menuGroup: 'Transform',
    fields: [
        { label: 'Column', name: 'column', type: InputType.TEXT }
    ],
    ports: {
        in: [
            { name: 'in', type: 'row[]' }
        ],
        out: [
            { name: 'out', type: 'scalar' }
        ]
    }
};

const point: GraphNodeConfig = {
    title: 'Point',
    menuGroup: 'Output',
    fields: [],
    ports: {
        in: [
            { name: 'x', type: 'scalar' },
            { name: 'y', type: 'scalar' },
            { name: 'series', type: 'scalar' }
        ],
        out: []
    }
};

const output: GraphNodeConfig = {
    title: 'Output',
    role: GraphNodeRole.OUTPUT,
    menuGroup: 'Output',
    fields: [
        {
            label: 'Property',
            name: 'property',
            type: InputType.SELECT,
            inputParams: (context) => {
                return {
                    options: (context as ChartContext).properties
                };
            }
        }
    ],
    ports: {
        in: [
            { name: 'in', type: 'scalar' }
        ],
        out: []
    }
};

export const graphSpec: GraphConfig = {
    inputs,
    nodes: {
        grid,
        group,
        sum,
        point,
        output
    },
    portTypes: {
        row: {
            color: 'red'
        },
        'row[]': {
            color: 'orange'
        },
        scalar: {
            color: 'green'
        }
    }
};
