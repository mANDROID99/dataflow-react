import { ViewConfig } from './valueTypes';
import { ReportDefinition } from "./reportTypes";

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

export type ChartParams = {
    renderView?(viewId: string, viewConfig: ViewConfig): void;
    requestHandler: RequestHandler;
    variables: {
        [key: string]: unknown;
    };
    reports: ReportDefinition[];
};
