import App from 'corky/app'
import { mountToDom } from 'corky/tags/mount';
import { Route } from 'corky/routing/route'
import { AppContainer} from './element/appContainer';
import { appReducer, goToView, PageActive } from './ducks/appDuck';
import {chatReducer} from './ducks/chatDuck';
import {dashboardReducer, dashboardInit} from './ducks/dashboardDuck';
import IModel from './model';

export var app = new App<IModel>(
    {
        app: appReducer,
        chat: chatReducer,
        dashboard: dashboardReducer
    });

app.setRouter([
    new Route({
        address: "/dashboard",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Dashboard }));
            app.dispatch(dashboardInit.payload({query:{q: "avengers"}}));
            //app.dispatch(getImageFromImdb.payload({ query:{template : {id: "tt0848228"}}}));
        }
    }),
    new Route({
        address: "/profile",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Profile }));
        }
    }),
    new Route({
        address: "/search",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Search }));
        },
        subroutes: [
            new Route({
                address: "/:query",
                on: (q) => {
                    // app.dispatch(giphySearch.payload({query:{q: q}}));
                }
            })
        ]
    }),
    new Route({
        address: "/chat",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Chat }));
        }
    })
], '/dashboard');
app.init("#app", AppContainer);