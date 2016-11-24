import {IAppState} from './ducks/appDuck';
import {IChatState} from './ducks/chatDuck';

export interface IModel {
    app: IAppState;
    chat: IChatState;
}
export default IModel;