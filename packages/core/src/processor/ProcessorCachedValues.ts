
export class PortValue {
    private _value: unknown;
    private _hasValue: boolean;

    constructor() {
        this._value = null;
        this._hasValue = false;
    }

    reset() {
        this._hasValue = false;
    }

    setValue(value: unknown) {
        this._value = value;
        this._hasValue = true;
    }

    getValue() {
        if (!this.hasValue()) {
            throw new Error('value not set');
        }

        return this._value;
    }

    hasValue() {
        return this._hasValue;
    }
}

export class PortCachedValues {
    private _values: PortValue[];
    private _results: unknown[];
    private _remaining: number;

    constructor() {
        this._values = [];
        this._results = [];
        this._remaining = 0;
    }

    reset(): void {
        this._remaining = this._values.length;
        for (const value of this._values) {
            value.reset();
        }
    }

    register(index: number): void {
        if (!(index in this._values)) {
            this._values[index] = new PortValue();
            this._remaining++;
        }
    }

    setValue(index: number, value: unknown): void {
        const v = this._values[index];
        if (!v) return;
            
        if (this._remaining > 0 && !v.hasValue()) {
            v.setValue(value);

            if (v.hasValue()) {
                this._remaining--;
                this._results[index] = v.getValue();
            }
            
        } else {
            v.setValue(value);
            this._results[index] = v.getValue();
        }
    }

    getValue(): unknown[] {
        if (!this.hasValue()) {
            throw new Error('value not set');
        }

        return this._results;
    }

    hasValue(): boolean {
        return this._remaining === 0;
    }
}

export class ProcessorCachedValues {
    private readonly _values: { [key: string]: PortCachedValues | undefined };
    private readonly _results: { [key: string]: unknown[] };
    
    private _size: number;
    private _remaining: number;

    constructor(results: { [key: string]: unknown[] }) {
        this._results = results;
        this._values = {};
        this._size = 0;
        this._remaining = 0;
    }

    reset(): void {
        const values = this._values;

        for (const key in values) {
            const value = values[key];

            if (value) {
                value.reset();
            }
        }

        this._remaining = this._size;
    }

    register(portName: string, index: number): void {
        let values = this._values[portName];

        if (!values) {
            values = new PortCachedValues();
            this._values[portName] = values;
            this._size++;
            this._remaining++;
        }

        values.register(index);
    }

    setValue(portName: string, index: number, value: unknown): void {
        const values = this._values[portName];
        if (!values) return;

        if (this._remaining > 0 && !values.hasValue()) {
            values.setValue(index, value);

            if (values.hasValue()) {
                this._remaining--;
                this._results[portName] = values.getValue();
            }

        } else {
            values.setValue(index, value);
            this._results[portName] = values.getValue();
        }
    }

    getValue(): { [key: string]: unknown[] } {
        if (!this.hasValue()) {
            throw new Error('value not set');
        }

        return this._results;
    }

    hasValue(): boolean {
        return this._remaining === 0;
    }
}
