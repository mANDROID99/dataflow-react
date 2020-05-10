import React from 'react';

type Props = {
    label: string;
    children: React.ReactChild;
}

export default function FieldGroup(props: Props) {
    return (
        <div className="ngraph-form-field-group">
            <div className="ngraph-form-field-label">
                {props.label}
            </div>
            {props.children}
        </div>
    );
}
