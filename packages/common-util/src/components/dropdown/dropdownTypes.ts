export type MenuOptionConfig = {
    label: string;
    action: () => void;
}

export type MenuConfig = {
    title: string,
    options: MenuOptionConfig[];
}
