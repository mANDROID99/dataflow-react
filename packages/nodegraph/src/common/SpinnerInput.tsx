import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    min?: number;
    max?: number;
    tabIndex?: number;
    value: number;
    onChange: (value: number) => void;
}

function toNumber(input: string): number {
    const value = +input;
    return isNaN(value) ? 0 : value;
}

function clamp(value: number, min: number | undefined, max: number | undefined): number {
    if (min != null && value < min) {
        value = min;
    }

    if (max != null && value > max) {
        value = max;
    }

    return value;
}

function SpinnerInput(props: Props) {
    const valueStr = '' + props.value;
    const [buffValue, setBuffValue] = useState(valueStr);

    const valueRef = useRef(valueStr);
    useEffect(() => {
        if (valueRef.current !== valueStr)  {
            setBuffValue(valueStr);
        }
    }, [valueStr]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuffValue(e.target.value);
    };

    const commitValue = (value: number) => {
        value = clamp(value, props.min, props.max);
        setBuffValue('' + value);
        props.onChange(value);
    };

    const handleBlur = () => {
        commitValue(toNumber(buffValue));
    };

    const handleDecrement = () => {
        commitValue(toNumber(buffValue) - 1);
    };

    const handleIncrement = () => {
        commitValue(toNumber(buffValue) + 1);
    };

    return (
        <div className="ngraph-spinner">
            <input
                className="ngraph-spinner-input"
                value={buffValue}
                onChange={handleChange}
                onBlur={handleBlur}
                tabIndex={props.tabIndex}
            />
            <div className="ngraph-spinner-btn-group ngraph-btn-group">
                <button className="ngraph-spinner-btn ngraph-btn secondary" onClick={handleDecrement} tabIndex={-1}>
                    <FontAwesomeIcon icon="minus"/>
                </button>
                <button className="ngraph-spinner-btn ngraph-btn secondary" onClick={handleIncrement} tabIndex={-1}>
                    <FontAwesomeIcon icon="plus"/>
                </button>
            </div>
        </div>
    );
}

export default React.memo(SpinnerInput);
