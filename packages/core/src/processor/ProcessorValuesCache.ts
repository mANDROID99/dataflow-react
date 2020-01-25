
export class ValueCache {
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

export class PortValuesCache {
    private _values: ValueCache[];
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
            this._values[index] = new ValueCache();
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

export class ProcessorValuesCache {
    private readonly _ports: { [key: string]: PortValuesCache | undefined };
    private readonly _values: { [key: string]: unknown[] };
    
    private _size: number;
    private _remaining: number;

    constructor(portNames: string[]) {
        this._values = {};
        this._ports = {};
        this._size = 0;
        this._remaining = 0;

        for (const port of portNames) {
            this._values[port] = [];
        }
    }

    reset(): void {
        const values = this._ports;

        for (const key in values) {
            const value = values[key];

            if (value) {
                value.reset();
            }
        }

        this._remaining = this._size;
    }

    register(portName: string, index: number): void {
        let values = this._ports[portName];

        if (!values) {
            values = new PortValuesCache();
            this._ports[portName] = values;
            this._size++;
            this._remaining++;
        }

        values.register(index);
    }

    setValue(portName: string, index: number, value: unknown): void {
        const port = this._ports[portName];
        if (!port) return;

        if (this._remaining > 0 && !port.hasValue()) {
            port.setValue(index, value);

            if (port.hasValue()) {
                this._remaining--;
                this._values[portName] = port.getValue();
            }

        } else {
            port.setValue(index, value);
            this._values[portName] = port.getValue();
        }
    }

    getValues(): { [key: string]: unknown[] } {
        if (!this.hasValues()) {
            throw new Error('value not set');
        }

        return this._values;
    }

    hasValues(): boolean {
        return this._remaining === 0;
    }
}
