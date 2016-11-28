import App from 'corky/app'
import { mountToDom } from 'corky/tags/mount';
import { Route } from 'corky/routing/route'
import { AppContainer} from './element/appContainer';
import {searchReducer, searchMovieByTitle} from './ducks/searchDuck';
import { appReducer, goToView, PageActive } from './ducks/appDuck';
import {dashboardReducer, getImageFromImdb, getMovies} from './ducks/dashboardDuck';
import {chatReducer,startConversation,getChatMessages} from './ducks/chatDuck';

import IModel from './model';
var timingInterval = undefined;

export var app = new App<IModel>(
    {
        app: appReducer,
        chat: chatReducer,
        dashboard: dashboardReducer,
        search: searchReducer
    });

app.setRouter([
    new Route({
        address: "/dashboard",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Dashboard }));
            app.dispatch(getMovies.payload({}));
            if(timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined;
        }
    }),
    new Route({
        address: "/profile",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Profile }));
            if(timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined;
        }
    }),
    new Route({
        address: "/search",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Search }));
            if(timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined; 
            
        }, 
        subroutes: [
            new Route({
                address: "/:query",
                on: (q) => {
                    if(timingInterval)
                        clearInterval(timingInterval);
                    timingInterval = undefined;
                    app.dispatch(goToView.payload({ view: PageActive.Search }));
                    app.dispatch(searchMovieByTitle.payload({query:{title: decodeURI(q)}}));
                }
            }) 
        ]
    }),
    new Route({
        address: "/chat",
        on: () => {
            app.dispatch(startConversation.payload({}));
            app.dispatch(goToView.payload({ view: PageActive.Chat }));
            if(timingInterval === undefined){
               timingInterval = setInterval(function(k){
                    app.dispatch(getChatMessages);
                },1000)
            }
        }
    })
], '/dashboard');
app.init("#app", AppContainer);