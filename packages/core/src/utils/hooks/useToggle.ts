import { useReducer } from "react";

export function useToggle(initialState: boolean) {
    return useReducer((prev: boolean) => !prev, initialState) as [boolean, () => void];
}
