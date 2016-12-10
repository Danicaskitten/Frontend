import {IAppState} from './ducks/appDuck';
import {IChatState} from './ducks/chatDuck';
import {IDashboardState} from './ducks/dashboardDuck';
import {ISearchState} from './ducks/searchDuck';
import {IAdvancedSearchState} from './ducks/advancedSearchDuck';
import {ICinemaSearchState} from './ducks/cinemaSearchDuck';

export interface IModel {
    app: IAppState;
    chat: IChatState;
    dashboard: IDashboardState;
    search: ISearchState;
    advancedSearch: IAdvancedSearchState;
    cinemaSearch: ICinemaSearchState;
}
export default IModel;