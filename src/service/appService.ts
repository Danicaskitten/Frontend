import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import { PageActive } from '../ducks/appDuck';

export class AppService extends Service {
    isContainer = true;
    selector =
    (state: IModel) => (
        {
            active: state.app.active,
            username: state.app.user.username,
            userurl: state.app.user.userpicture
        }
    );
}

var appService = new AppService();

export default appService;