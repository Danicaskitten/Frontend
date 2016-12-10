import Flux from 'corky/flux';

export enum PageActive {
    None,
    Chat,
    Search,
    Dashboard,
    Profile,
    AdvancedSearch,
    CinemaSearch
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
        username: "Test user",
        userpicture: "https://api.adorable.io/avatars/face/eyes5/nose7/mouth3/47B39D"
    }
}

export const goToView = new Flux.Action<{ view: PageActive }>("SWITCH_VIEW");

export var appReducer = new Flux.Reducer<IAppState>([
    {
        action: goToView,
        reduce: (state: IAppState, payload: { view: PageActive }) => {
            state.active = payload.view;
        }
    }
], initialState);