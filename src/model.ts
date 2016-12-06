import {IAppState} from './ducks/appDuck';
import {IChatState} from './ducks/chatDuck';
import {IDashboardState} from './ducks/dashboardDuck';
import {ISearchState} from './ducks/searchDuck';
import {IAdvancedSearchState} from './ducks/advancedSearchDuck';

export interface IModel {
    app: IAppState;
    chat: IChatState;
    dashboard: IDashboardState;
    search: ISearchState;
    advancedSearch: IAdvancedSearchState;
}
export default IModel;