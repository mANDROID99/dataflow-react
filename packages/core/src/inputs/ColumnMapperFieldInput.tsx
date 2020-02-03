import React, { useMemo } from "react";
import cn from 'classnames';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FieldInputProps } from "../types/graphInputTypes";
import { ColumnMapperType, ColumnMapperInputValue } from "../types/graphInputTypes";
import CommonTextInput from "../common/CommonTextInput";
import CommonSelectInput, { Option } from "../common/CommonSelectInput";
import { columnMapperToExpression } from "../utils/expressionUtils";

function isExpressionType(input: ColumnMapperInputValue) {
    return typeof input === 'string';
}

export default function ColumnMapperFieldInput(props: FieldInputProps<ColumnMapperInputValue>) {
    const { value, onChanged, params } = props;
    const target = params.target as string | undefined;
    
    const options = useMemo(() => {
        let opts: Option[] = (params.columns as Option[]) || [];

        if (params.optional) {
            opts = ['' as Option].concat(opts);
        }

        return opts;
    }, [params]);
    
    const handleToggle = () => {
        if (typeof value === 'string') {
            onChanged({
                type: ColumnMapperType.COLUMN,
                value: ''
            });

        } else {
            const input = columnMapperToExpression(value || '', target);
            onChanged(input);
        }
    };

    function renderInput() {
        if (value == null || typeof value === 'string') {
            return <CommonTextInput value={value || ''} onChange={onChanged}/>;

        } else {
            return (
                <CommonSelectInput
                    value={value.value}
                    options={options}
                    onChange={(value) => {
                        onChanged({ type: ColumnMapperType.COLUMN, value });
                    }}
                />
            );
        }
    }

    const toggled = isExpressionType(value || '');

    return (
        <div className="ngraph-expr-input">
            {renderInput()}
            <div className={cn("ngraph-expr-input-toggle ngraph-btn", { secondary: !toggled })} onClick={handleToggle}>
                <FontAwesomeIcon icon="code"/>
            </div>
        </div>
    );
}
