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

var latitude = "";
var longitude = "";

export const advancedMovieSearchLocation = new Flux.RequestAction<{template:{longitude: string, latitude: string}, query: { StartDate: string, EndDate: string;}}, any>("ADVANCE_SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v2/movies/near/{latitude}/{longitude}/", "GET");
export const getLocationFromOSMAdvanced = new Flux.RequestAction<{template: {city: string}}, any>("GET_LOCATION_ADVANCED", "http://nominatim.openstreetmap.org/search/{city}?format=json", "GET");

export var advancedSearchReducer = new Flux.Reducer<IAdvancedSearchState>([
    {
           action: advancedMovieSearchLocation.request,
           reduce: (state: IAdvancedSearchState, payload: any) => {
               payload.options = {};
               payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
           }
       },
    {
        action: advancedMovieSearchLocation.response,
        reduce: (state: IAdvancedSearchState, payload: any) => {
            state.result = payload.Data;
        }
    },
    {
        action: getLocationFromOSMAdvanced.response,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            longitude = payload[0].lon; 
            latitude = payload[0].lat;
            getLocation();
        }
    }
],initialState);

function getLocation(){
    setTimeout(function(){
        app.dispatch(advancedMovieSearchLocation.payload({template:{longitude: longitude, latitude: latitude}, query: {StartDate: "", EndDate: "12/14/2016"}}));
    }, 3000);
}