import Flux from 'corky/flux';
import {app} from '../main';

export enum PageActive {
    None,
    Chat,
    Search,
    Dashboard,
    Profile,
    Register,
    Login
}
export interface Profile {
    username: string,
    userpicture: string
}

export interface IAppState {
    active: PageActive,
    user: Profile
}

var initialState: IAppState = {
    active: PageActive.None,
    user: {
        username: "",
        userpicture: "https://api.adorable.io/avatars/face/eyes5/nose7/mouth3/47B39D"
    }
}

export interface ITokenResponse{
    access_token: string;
    token_type: string;
    userName: string;
    ".issued": string;
    ".expires": string;
}

export const goToView = new Flux.Action<{ view: PageActive }>("SWITCH_VIEW");
export const registerUser = new Flux.RequestAction<{data:{Email: string, Password: string, ConfirmPassword: string}, options:any},any>
                            ("REGISTER_USER","https://moviebot-rage.azurewebsites.net/api/Account/Register","POST");
export const loginUser = new Flux.RequestAction<{data:{userName: string, password: string, grant_type: string}, options:any},ITokenResponse>
                            ("LOGIN_USER","https://moviebot-rage.azurewebsites.net/Token","POST");
export const readStorage = new Flux.Action("READ_STORAGE");
export var appReducer = new Flux.Reducer<IAppState>([
    {
        action:readStorage,
        reduce:(state: IAppState, payload:any)=>{
            state.user.username = localStorage.getItem("user");
        }
    },
    {
        action: goToView,
        reduce: (state: IAppState, payload: { view: PageActive }) => {
            state.active = payload.view;
        }
    },
    {
        action: registerUser.request,
        reduce: (state: IAppState, payload: {data:{Email: string, Password: string, ConfirmPassword: string}, options:any}) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
     {
        action: registerUser.response,
        reduce: (state: IAppState, payload: any) => {
            console.log("Success", payload);
            state.active = PageActive.Login;
        }
    },
    {
        action: registerUser.error,
        reduce: (state: IAppState, payload: any) => {
           console.log("Error occured", payload);
        }
    },
     {
        action: loginUser.request,
        reduce: (state: IAppState, payload: {data:{userName: string, password: string, grant_type: string}, options:any}) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
        }
    },
     {
        action: loginUser.response,
        reduce: (state: IAppState, payload: ITokenResponse) => {
            console.log("Success", payload);
            app.redirect('/dashboard');
            state.user.username = payload.userName;
            localStorage.setItem('user', payload.userName);
            localStorage.setItem('token', payload.access_token);
            localStorage.setItem('expires', payload[".expires"]);
            console.log("payload login", payload);
        }
    },
    {
        action: loginUser.error,
        reduce: (state: IAppState, payload: any) => {
           console.log("Error occured", payload);
        }
    }
], initialState);