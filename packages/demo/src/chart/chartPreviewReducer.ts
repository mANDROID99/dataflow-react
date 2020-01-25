import { ChartConfig } from "../types/valueTypes";

type PreviewState = {
    charts: {
        [chartId: string]: ChartConfig;
    }
}

enum ActionType {
    RESET,
    SET_CHART_CONFIG
}

type ResetAction = {
    type: ActionType.RESET;    
}

type SetChartConfigAction = {
    type: ActionType.SET_CHART_CONFIG;
    chartId: string;
    chartConfig: ChartConfig
};

type Action = ResetAction | SetChartConfigAction;

function handleReset(): PreviewState {
    return {
        charts: {}
    };
}

function handleSetChartConfig(state: PreviewState, action: SetChartConfigAction): PreviewState {
    const charts = Object.assign({}, state.charts);
    charts[action.chartId] = action.chartConfig;
    return { charts };
}

export function chartPreviewReducer(state: PreviewState, action: Action): PreviewState {
    switch (action.type) {
        case ActionType.RESET:
            return handleReset();

        case ActionType.SET_CHART_CONFIG:
            return handleSetChartConfig(state, action);

        default:
            return state;
    }
}

export function setChartConfig(chartId: string, chartConfig: ChartConfig): SetChartConfigAction {
    return { type: ActionType.SET_CHART_CONFIG, chartId, chartConfig };
}

export function reset(): ResetAction {
    return { type: ActionType.RESET };
}
