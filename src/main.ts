import App from 'corky/app'
import { mountToDom } from 'corky/tags/mount';
import { Route } from 'corky/routing/route'
import { AppContainer } from './element/appContainer';
import { searchReducer, searchMovieByTitle } from './ducks/searchDuck';
import { appReducer, goToView, PageActive,readStorage} from './ducks/appDuck';
import { dashboardReducer, getImageFromImdb, getMovies } from './ducks/dashboardDuck';
import { chatReducer, startConversation, getChatMessages } from './ducks/chatDuck';

import IModel from './model';
var timingInterval = undefined;

var checkIfUserLoggedIn = () => {
            var token = localStorage.getItem('token');
            var expires = localStorage.getItem('expires')
            if (localStorage.getItem("user") === null ||( token !== null && expires !== null && new Date(expires) < new Date())) {
                app.redirect('/login');
            }
            else{
                 app.dispatch(readStorage);
            }
        };

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
            if (timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined;
        },
        before: checkIfUserLoggedIn
    }),
    new Route({
        address: "/profile",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Profile }));
            if (timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined;
        },
        before: checkIfUserLoggedIn
    }),
    new Route({
        address: "/search",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Search }));
            if (timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined;

        },
        subroutes: [
            new Route({
                address: "/:query",
                on: (q) => {
                    if (timingInterval)
                        clearInterval(timingInterval);
                    timingInterval = undefined;
                    app.dispatch(goToView.payload({ view: PageActive.Search }));
                    app.dispatch(searchMovieByTitle.payload({ query: { title: decodeURI(q) } }));
                }
            })
        ],
        before: checkIfUserLoggedIn
    }),
    new Route({
        address: "/chat",
        on: () => {
            app.dispatch(startConversation.payload({}));
            app.dispatch(goToView.payload({ view: PageActive.Chat }));
            if(timingInterval === undefined){
               timingInterval = setInterval(function(k){
                   if(app.getState().chat.conversationId !== undefined)
                    app.dispatch(getChatMessages);
                }, 1000)
            }
        },
        before: checkIfUserLoggedIn
    }),
    new Route({
        address: '/init',
        on: () => {
            var token = localStorage.getItem('token');
            var expires = localStorage.getItem('expires')
            if (localStorage.getItem("user") === null ||( token !== null && expires !== null && new Date(expires) < new Date())) {
                app.redirect('/login');
            }
            else{
                app.redirect('/dashboard');
                app.dispatch(readStorage);
            }
        }
    }),
    new Route({
        address: '/register',
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Register }));
        }
    }),
    new Route({
        address: '/login',
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Login }));
        }
    })
], '/init');
app.init("#app", AppContainer);