import { Element } from 'corky/tags/element';
import template from '../template';
import dashboardService from '../service/dashboardService';
import {ISuggestion} from '../ducks/dashboardDuck';

export interface IDashboardResult {
    result: Array<ISuggestion>;
}

@template("dashboard", dashboardService)
export abstract class DashboardResult extends Element implements IDashboardResult {
    result: Array<ISuggestion>;
}