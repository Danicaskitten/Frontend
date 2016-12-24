import {IAppState} from './ducks/appDuck';
import {IChatState} from './ducks/chatDuck';
import {IDashboardState} from './ducks/dashboardDuck';
import {ISearchState} from './ducks/searchDuck';
import {IAdvancedSearchState} from './ducks/advancedSearchDuck';
import {ICinemaSearchState} from './ducks/cinemaSearchDuck';
import {IReservationState} from './ducks/reservationDuck';

export interface IModel {
    app: IAppState;
    chat: IChatState;
    dashboard: IDashboardState;
    search: ISearchState;
    advancedSearch: IAdvancedSearchState;
    cinemaSearch: ICinemaSearchState;
    reservation: IReservationState;
}
export default IModel;