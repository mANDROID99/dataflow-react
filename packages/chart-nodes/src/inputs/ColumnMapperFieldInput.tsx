import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommonSelectInput, CommonTextInput, InputProps, Option } from "@react-ngraph/core";
import cn from 'classnames';
import React, { useMemo } from "react";
import { ColumnMapperInputValue, ColumnMapperType } from "../types/inputTypes";
import { columnMapperToExpression, getColumnMapperType } from "../utils/columnMapperUtils";


export default function ColumnMapperFieldInput(props: InputProps<ColumnMapperInputValue>) {
    const { value, onChanged, params } = props;
    const target = params.target as string | undefined;
    
    const options = useMemo(() => {
        let opts: Option[] = (params.columns as Option[] | undefined) || [];

        if (params.optional) {
            opts = ['' as Option].concat(opts);
        }

        return opts;
    }, [params]);
    
    const handleToggle = () => {
        if (typeof value === 'string') {
            onChanged({
                type: ColumnMapperType.EXPRESSION,
                value: columnMapperToExpression(value || '', target) ?? ''
            });

        } else {
            onChanged('');
        }
    };

    function renderInput() {
        if (value == null) {
            return;

        } else if (typeof value === 'string') {
            return (
                <CommonSelectInput
                    value={value}
                    options={options}
                    onChange={onChanged}
                />
            );
            

        } else if (value.type === ColumnMapperType.EXPRESSION) {
            return (
                <CommonTextInput
                    value={value.value}
                    onChange={(value: string) => {
                        onChanged({
                            type: ColumnMapperType.EXPRESSION,
                            value
                        });
                    }}
                />
            );
        }
    }

    const toggled = value != null
        ? getColumnMapperType(value) === ColumnMapperType.EXPRESSION : false;

    return (
        <div className="ngraph-expr-input">
            {renderInput()}
            <div className={cn("ngraph-expr-input-toggle ngraph-btn", { secondary: !toggled })} onClick={handleToggle}>
                <FontAwesomeIcon icon="code"/>
            </div>
        </div>
    );
}
