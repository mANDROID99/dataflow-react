export type MenuOptionConfig = {
    label: string;
    disabled?: boolean;
    action: () => void;
}

export type MenuConfig = {
    title: string,
    options: MenuOptionConfig[];
}
