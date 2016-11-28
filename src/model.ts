import {IAppState} from './ducks/appDuck';
import {IChatState} from './ducks/chatDuck';
import {IDashboardState} from './ducks/dashboardDuck';
import {ISearchState} from './ducks/searchDuck';

export interface IModel {
    app: IAppState;
    chat: IChatState;
    dashboard: IDashboardState;
    search: ISearchState;
}
export default IModel;