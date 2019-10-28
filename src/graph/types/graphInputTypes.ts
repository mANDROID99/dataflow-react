export type GraphFieldInputProps<T> = {
    value: T | undefined;
    onChanged(value: T): void;
}
