import {IAppState} from './ducks/appDuck';
import {IChatState} from './ducks/chatDuck';
import {IDashboardState} from './ducks/dashboardDuck';

export interface IModel {
    app: IAppState;
    chat: IChatState;
    dashboard: IDashboardState;
}
export default IModel;