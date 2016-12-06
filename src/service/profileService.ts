import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {registerUser, loginUser} from '../ducks/appDuck';

export class ProfileService extends Service {
    selector =
    (state: IModel) => (
        {
           username: state.app.user.username
        }
    );
    actions = {
        register: (email:string, password: string, confirm:string) => registerUser.payload({data:{email: email, password: password, ConfirmPassword: confirm},options:{}}),
        login: (email:string, password: string) => loginUser.payload({data:{userName:email, password: password, grant_type: "password"}, options: {}})
    }
}

var profileService = new ProfileService();

export default profileService;