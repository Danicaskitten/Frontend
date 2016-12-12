import Flux from 'corky/flux';
import {app} from '../main';

export interface ICinemaSearchMovieResult{
    Name: string,
    CinemaID: string,
    Address: string,
    Latitude: string,
    Longitude: string,
    PhoneNumber: string,
    Region: string,
    Province: string,
    City: string
}


export interface ICinemaSearchState{
    query: string;
    cinemaResult: Array<ICinemaSearchMovieResult>
}

var initialState : ICinemaSearchState = {
    query: "",
    cinemaResult: []
};

var coordinates = [];

export const cinemaMovieSearchLocation = new Flux.RequestAction<{template:{longitude: string, latitude: string}}, any>("ADVANCE_SEARCH_CINEMA", "http://moviebot-rage.azurewebsites.net/api/v2/cinemas/location/{latitude}/{longitude}/", "GET");
export const getLocationFromBing = new Flux.RequestAction<{query: {query: string, key: string;}}, any>("GET_LOCATION", "http://dev.virtualearth.net/REST/v1/Locations", "GET");

export var cinemaSearchReducer = new Flux.Reducer<ICinemaSearchState>([
    {
           action: cinemaMovieSearchLocation.request,
           reduce: (state: ICinemaSearchState, payload: any) => {
               payload.options = {};
               payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
           }
       },
    {
        action: cinemaMovieSearchLocation.response,
        reduce: (state : ICinemaSearchState, payload: any) => {
            state.cinemaResult = payload.Data;
        }
    },
    {
        action: getLocationFromBing.request,
        reduce: (state : ICinemaSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
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
        app.dispatch(cinemaMovieSearchLocation.payload({template:{longitude: coordinates[1], latitude: coordinates[0]}}));
    }, 3000);
}