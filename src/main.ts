import App from 'corky/app'
import { mountToDom } from 'corky/tags/mount';
import { Route } from 'corky/routing/route'
import { AppContainer } from './element/appContainer';
import { searchReducer, searchMovieByTitle } from './ducks/searchDuck';
import { appReducer,logoutUser, goToView, PageActive,readStorage,loadUserGenres} from './ducks/appDuck';
import { dashboardReducer, getImageFromImdb, getMovies } from './ducks/dashboardDuck';
import { chatReducer, startConversation, getChatMessages } from './ducks/chatDuck';
import {reservationReducer} from './ducks/reservationDuck';
import {advancedSearchReducer, getLocationForInfoAdvanced} from './ducks/advancedSearchDuck';
import {cinemaSearchReducer, getLocationFromGoogleApi, getLocationForInfo} from './ducks/cinemaSearchDuck';
import {getUserReservationHistory} from './ducks/reservationDuck';
import {mapKey} from './config';

import IModel from './model';
var timingInterval = undefined;

var checkIfUserLoggedIn = () => {
            var token = localStorage.getItem('token');
            var expires = localStorage.getItem('expires')
            if (localStorage.getItem("user") === null || localStorage.getItem("user") === "null" ||( token !== null && expires !== null && new Date(expires) < new Date())) {
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
        search: searchReducer,
        advancedSearch: advancedSearchReducer,
        cinemaSearch: cinemaSearchReducer,
        reservation: reservationReducer
    });

app.setRouter([
     new Route({
        address: "/reservationHistory",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.ReservationHistory }));            
            app.dispatch(getUserReservationHistory.payload({options:{}}));
            if (timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined;
        },
        before: checkIfUserLoggedIn
    }),
     new Route({
        address: "/reserve",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Reservation }));
            if (timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined;
        },
        before: checkIfUserLoggedIn
    }),
     new Route({
        address: "/reservation",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Reservation}));
            if (timingInterval)
                clearInterval(timingInterval); 
            timingInterval = undefined;
        },
        before: checkIfUserLoggedIn
    }),
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
        address: "/logout",
        on: () => {
            
            app.dispatch(logoutUser.payload({}));           
            if (timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined;
            app.redirect('/login');
        },
        before: checkIfUserLoggedIn
    }),
    new Route({
        address: "/profile",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.Profile }));
            app.dispatch(loadUserGenres.payload({}));
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
        address: "/advancedSearch",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.AdvancedSearch }));
            app.dispatch(getLocationForInfoAdvanced.payload({query: {key: mapKey}}));
            if(timingInterval)
                clearInterval(timingInterval);
            timingInterval = undefined; 
        }
    }),
    new Route({
        address: "/cinemaSearch",
        on: () => {
            app.dispatch(goToView.payload({ view: PageActive.CinemaSearch }));
            app.dispatch(getLocationForInfo.payload({query: {key: mapKey}}));
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
                    app.dispatch(goToView.payload({ view: PageActive.CinemaSearch }));
                    //app.dispatch(advancedMovieSearch.payload({query:{title: decodeURI(q)}}));
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