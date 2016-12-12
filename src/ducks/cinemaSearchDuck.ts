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

var latitude = "";
var longitude = "";

export const cinemaMovieSearchLocation = new Flux.RequestAction<{template:{longitude: string, latitude: string}}, any>("ADVANCE_SEARCH_CINEMA", "http://moviebot-rage.azurewebsites.net/api/v2/cinemas/location/{latitude}/{longitude}/", "GET");
export const getLocationFromOSMCinema = new Flux.RequestAction<{template: {city: string}}, any>("GET_LOCATION_CINEMA", "http://nominatim.openstreetmap.org/search/{city}?format=json", "GET");

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
        action: getLocationFromOSMCinema.request,
        reduce: (state : ICinemaSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getLocationFromOSMCinema.response,
        reduce: (state : ICinemaSearchState, payload: any) => {
            longitude = payload[0].lon; 
            latitude = payload[0].lat;
            getLocation();
        }
    }
],initialState);

function getLocation(){
    setTimeout(function(){
        app.dispatch(cinemaMovieSearchLocation.payload({template:{longitude: longitude, latitude: latitude}}));
    }, 3000);
}