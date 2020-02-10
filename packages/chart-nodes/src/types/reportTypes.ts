
export type ReportParam = {
    name: string;
    defaultValue: unknown;
}

export type ReportDefinition = {
    name: string;
    uuid: string;
    parameters: ReportParam[];
}
