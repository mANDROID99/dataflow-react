import React, { useMemo, useRef } from "react";
import { DataGridInputValue } from "../../types/graphInputTypes";
import Button from "../../common/Button";
import SimpleTable from "../../common/table/SimpleTable";
import { Column } from "../../common/table/simpleTableTypes";

type Props = {
    columnNames: string[];
    rows: string[][];
    onHide: () => void;
    onSubmit: (value: DataGridInputValue) => void;
}

const COLUMN_TEMPLATE: Column = {
    name: '',
    editable: true,
    width: 100,
    minWidth: 30
}

function DataGridTable({ columnNames, rows, onHide, onSubmit }: Props) {
    const columns: Column[] = useMemo(() => {
        return columnNames.map<Column>(columnName => ({
            ...COLUMN_TEMPLATE,
            name: columnName
        }))
    }, [columnNames]);

    const ref = useRef({ columns, rows });

    const handleSave = () => {
        const columnNames: string[] = ref.current.columns.map(col => col.name);
        const rowValues: string[][] = ref.current.rows;

        onSubmit({
            columns: columnNames,
            rows: rowValues
        });
    };

    const handleTableChanged = (columns: Column[], rows: string[][]) => {
        ref.current = { columns, rows };
    }

    return (
        <>
            <div className="ngraph-modal-body">
                <SimpleTable
                    columnTemplate={COLUMN_TEMPLATE}
                    columns={columns}
                    rows={rows}
                    onChanged={handleTableChanged}
                />
            </div>
            <div className="ngraph-modal-footer">
                <Button onClick={onHide} variant="secondary">Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </>
    );
}

export default DataGridTable;
