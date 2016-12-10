import Flux from 'corky/flux';
import {app} from '../main';

export interface ICinemaSearchMovieResult{
    Title: string,
    ImdbDb: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string
}


export interface ICinemaSearchState{
    query: string;
    result: Array<ICinemaSearchMovieResult>
}

var initialState : ICinemaSearchState = {
    query: "",
    result: []
};

var coordinates = [];

export const cinemaMovieSearch = new Flux.RequestAction<{query: { title: string;}},{"Data": Array<ICinemaSearchMovieResult>}>("SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v1/Search/Movie", "GET");
export const cinemaMovieSearchLocation = new Flux.RequestAction<{query: { longitude: string, latitude: string;}},{"Data": Array<ICinemaSearchMovieResult>}>("SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v1/Search/Movie", "GET");
export const getLocationFromBing = new Flux.RequestAction<{query: {query: string, key: string;}}, any>("GET_LOCATION", "http://dev.virtualearth.net/REST/v1/Locations", "GET");

export var cinemaSearchReducer = new Flux.Reducer<ICinemaSearchState>([
    {
        action: cinemaMovieSearch.response,
        reduce: (state : ICinemaSearchState, payload:{"Data": Array<ICinemaSearchMovieResult>}) => {
            state.result = payload.Data;
        }
    },
    {
        action: cinemaMovieSearchLocation.response,
        reduce: (state : ICinemaSearchState, payload:{"Data": Array<ICinemaSearchMovieResult>}) => {
            state.result = payload.Data;
        }
    },
    {
        action: getLocationFromBing.response,
        reduce: (state : ICinemaSearchState, payload: any) => {
            coordinates = payload.resourceSets[0].resources[0].point.coordinates;
            getLocation();
        }
    }
],initialState);

function getLocation(){
    setTimeout(function(){
        app.dispatch(cinemaMovieSearch.payload({ query: { title: "avengers"}}));
        //app.dispatch(advancedMovieSearchLocation.payload({ query: { longitude: coordinates[1], latitude: coordinates[0]}}));
    }, 3000);
}