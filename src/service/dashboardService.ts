import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {ISuggestion, dashboardInit} from '../ducks/dashboardDuck';

export class DashboardService extends Service {
    selector = (state: IModel) => ({
        result: state.dashboard.dashboard.result
    });
}

var dashboardService = new DashboardService();

export default dashboardService;