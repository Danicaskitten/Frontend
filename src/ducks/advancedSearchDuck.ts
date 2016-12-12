import Flux from 'corky/flux';
import {app} from '../main';

export interface IAdvancedSearchMovieResult{
    Title: string,
    ImdbID: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string
}

export interface IAdvancedArrayResponse {
    Data: Array<{
        Title: string,
        ImdbID: string,
        Poster: string,
        Runtime: string,
        Plot: string,
        Genre: string
    }>
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

export const advancedMovieSearchLocation = new Flux.RequestAction<{template:{longitude: string, latitude: string}, query: { StartDate: string, EndDate: string;}}, any>("ADVANCE_SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v2/movies/near/{latitude}/{longitude}/", "GET");
export const getLocationFromBing = new Flux.RequestAction<{query: {query: string, key: string;}}, any>("GET_LOCATION", "http://dev.virtualearth.net/REST/v1/Locations", "GET");

export var advancedSearchReducer = new Flux.Reducer<IAdvancedSearchState>([
    {
        action: advancedMovieSearchLocation.response,
        reduce: (state: IAdvancedSearchState, payload: any) => {
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
        //app.dispatch(advancedMovieSearchLocation.payload({template:{longitude: coordinates[1], latitude: coordinates[0]}, query: {StartDate: "", EndDate: ""}}));
    }, 3000);
}