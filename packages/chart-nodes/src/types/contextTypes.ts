import { ViewConfig } from './valueTypes';

export type ChartContext = {
    columns: string[];
    groupColumns?: string[];
};

export type RequestParams = {
    url: string;
    method: 'GET' | 'POST';
    headers: { [key: string]: string };
    body?: any;
}

export type RequestHandler = (params: RequestParams) => Promise<Response>;

export type ChartActions = {
    renderView?(viewId: string, viewConfig: ViewConfig): void;
    fetch: (params: RequestParams) => Promise<Response>;
}

export type ChartParams = {
    actions: ChartActions;
    variables: {
        [key: string]: unknown;
    };
    extra?: { [key: string]: any };
};
