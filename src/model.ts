import {IAppState} from './ducks/appDuck';
import {IChatState} from './ducks/chatDuck';
import {ISearchState} from './ducks/searchDuck';

export interface IModel {
    app: IAppState;
    chat: IChatState;
    search: ISearchState;
}
export default IModel;