import { GraphTemplate } from "@react-ngraph/core";

// import json files
import basicGrid from './basicGrid.json';
import basicLine from './basicLine.json';
import basicMultiline from './basicMultiLine.json';
import basicGroupBy from './groupBy.json';
import apiRequest from './apiRequest.json';
import drilldown from './drilldown.json';

const BASIC_GRID: GraphTemplate = {
    id: 'basic-grid',
    label: 'Basic Grid',
    data: basicGrid
};

const BASIC_LINE: GraphTemplate = {
    id: 'basic-line',
    label: 'Basic Line',
    data: basicLine
};

const BASIC_MULTILINE: GraphTemplate = {
    id: 'basic-multiline',
    label: 'Basic Multi-Line',
    data: basicMultiline
};

const BASIC_GROUP_BY: GraphTemplate = {
    id: 'basic-groupby',
    label: 'Basic Group-By',
    data: basicGroupBy
};

const API_REQUEST: GraphTemplate = {
    id: 'api-request',
    label: 'Api Request',
    data: apiRequest
};

const DRILLDOWN: GraphTemplate = {
    id: 'drilldown',
    label: 'Drilldown',
    data: drilldown
}

export const templates = [
    BASIC_GRID,
    BASIC_LINE,
    BASIC_MULTILINE,
    BASIC_GROUP_BY,
    API_REQUEST,
    DRILLDOWN
];
