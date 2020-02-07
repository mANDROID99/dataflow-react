import { Entry } from "@react-ngraph/core";
import { asNumber } from "./conversions";

const CHAR_PERIOD = 46;
const CHAR_OPEN = 91;
const CHAR_CLOSE = 93;

function split(keyPath: string) {
    const parts: (string | number)[] = [];
    const n = keyPath.length;
    let j = 0;

    for (let i = 0; i < n; i++) {
        const char = keyPath.charCodeAt(i);

         if (char === CHAR_PERIOD) {
            if (i > j) {
                parts.push(keyPath.slice(j, i));
                j = i + 1;
            }
            
        } else if (char === CHAR_OPEN) {
            if (i > j) {
                parts.push(keyPath.slice(j, i));
            }

            let k = i + 1;
            for (; k < n; k++) {
                if (keyPath.charCodeAt(k) === CHAR_CLOSE) {
                    break;
                }
            }

            if (k >= n) continue;

            const part = keyPath.slice(i + 1, k);
            const index = asNumber(part);
            parts.push(index);

            j = k + 1;
            i = k;
        }
    }

    if (j < n) {
        const part = keyPath.slice(j, n);
        parts.push(part);
    }

    return parts;
}

export function writeKeyPath(keyPath: string, value: unknown, result: { [key: string]: unknown }) {
    const parts: (string | number)[] = split(keyPath);

    if (parts.length > 0) {
        let parentKey: (string | number) = parts[0];
        let parent: any = result;

        for (let i = 1, n = parts.length; i < n; i++) {
            const part = parts[i];
            let x = parent[parentKey];

            if (x == null || typeof x !== 'object') {
                x = typeof part === 'string' ? {} : [];
                parent[parentKey] = x;
            }

            parentKey = part;
            parent = x;
        }

        parent[parentKey] = value;
    }
}

export function writeKeyValues(keyValues: Entry<unknown>[], result: { [key: string]: unknown }) {
    for (const kv of keyValues) {
        writeKeyPath(kv.key, kv.value, result);
    }
}
