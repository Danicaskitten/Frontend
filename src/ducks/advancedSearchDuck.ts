import Flux from 'corky/flux';
import {app} from '../main';

export interface IAdvancedSearchMovieResult{
    Title: string,
    ImdbDb: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string
}


export interface IAdvancedSearchState{
    query: string;
    result: Array<IAdvancedSearchMovieResult>
}

var initialState : IAdvancedSearchState = {
    query: "",
    result: []
};

var coordinates = [];

export const advancedMovieSearch = new Flux.RequestAction<{query: { title: string;}},{"Data": Array<IAdvancedSearchMovieResult>}>("SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v1/Search/Movie", "GET");
export const advancedMovieSearchLocation = new Flux.RequestAction<{query: { longitude: string, latitude: string;}},{"Data": Array<IAdvancedSearchMovieResult>}>("SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v1/Search/Movie", "GET");
export const getLocationFromBing = new Flux.RequestAction<{query: {query: string, key: string;}}, any>("GET_LOCATION", "http://dev.virtualearth.net/REST/v1/Locations", "GET");

export var advancedSearchReducer = new Flux.Reducer<IAdvancedSearchState>([
    {
        action: advancedMovieSearch.response,
        reduce: (state : IAdvancedSearchState, payload:{"Data": Array<IAdvancedSearchMovieResult>}) => {
            state.result = payload.Data;
        }
    },
    {
        action: advancedMovieSearchLocation.response,
        reduce: (state : IAdvancedSearchState, payload:{"Data": Array<IAdvancedSearchMovieResult>}) => {
            state.result = payload.Data;
        }
    },
    {
        action: getLocationFromBing.response,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            coordinates = payload.resourceSets[0].resources[0].point.coordinates;
            getLocation();
        }
    }
],initialState);

function getLocation(){
    setTimeout(function(){
        app.dispatch(advancedMovieSearch.payload({ query: { title: "avengers"}}));
        //app.dispatch(advancedMovieSearchLocation.payload({ query: { longitude: coordinates[1], latitude: coordinates[0]}}));
    }, 3000);
}