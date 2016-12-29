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
    City: string,
    Movies: Array<IMovieResponse>,
    mov: boolean
}

export interface IMovieResponse {
    Title: string,
    ImdbID: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string,
    CinemaId: string,
    Projections: Array<IProjection>
}


export interface IProjection {
    ImdbID: string,
    CinemaID: string,
    date: string,
    Time: string
}

export interface ICinemaSearchState{
    query: string,
    cinemaResult: Array<ICinemaSearchMovieResult>,
    myCity: string
}

var initialState : ICinemaSearchState = {
    query: "",
    cinemaResult: [],
    myCity: ""
};

var latitude = "";
var longitude = "";

export const cinemaMovieSearchLocation = new Flux.RequestAction<{template:{longitude: string, latitude: string}}, any>("ADVANCE_SEARCH_CINEMA", "http://moviebot-rage.azurewebsites.net/api/v2/cinemas/location/{latitude}/{longitude}/", "GET");
export const getLocationFromOSMCinema = new Flux.RequestAction<{template: {city: string}}, any>("GET_LOCATION_CINEMA", "http://nominatim.openstreetmap.org/search/{city}?format=json", "GET");
export const getLocationFromGoogleApi = new Flux.RequestAction<{query: {key: string}}, any>("GET_LOCATION_GOOGLE", "https://www.googleapis.com/geolocation/v1/geolocate", "POST");
export const getMovies = new Flux.RequestAction<{template: {cinemaId: string}}, any>("GET_MOVIES", "https://moviebot-rage.azurewebsites.net/api/v2/cinemas/id/{cinemaId}/movies?StartDate={StartDate}&EndDate={EndDate}", "GET");
export const getProjections = new Flux.RequestAction<{template:{cinemaId: string, imdbId: string}}, any>("GET_PROJECTIONS", "http://moviebot-rage.azurewebsites.net/api/v2/projections/list/{imdbId}/{cinemaId}/", "GET");
export const getLocationForInfo = new Flux.RequestAction<{query: {key: string}}, any>("GET_LOCATION_FOR_INFO", "https://www.googleapis.com/geolocation/v1/geolocate", "POST");
export const getCityName = new Flux.RequestAction<{query: {format: string, lat: string, lon: string}}, any>("GET_CITY_NAME", "http://nominatim.openstreetmap.org/reverse", "GET");

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
    },
    {
        action: getLocationFromGoogleApi.request,
        reduce: (state : ICinemaSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getLocationFromGoogleApi.response,
        reduce: (state : ICinemaSearchState, payload: any) => {
            longitude = payload.location.lng; 
            latitude = payload.location.lat;
            getLocation();
        }
    },
    {
        action: getMovies.request,
        reduce: (state : ICinemaSearchState, payload: any) => {
            state.cinemaResult.forEach(element => {
                if(element.CinemaID == payload.template.cinemaId){
                    element.mov = true;
                }
            });
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getMovies.response,
        reduce: (state : ICinemaSearchState, payload: any) => {
            state.cinemaResult.forEach(element => {
                if(element.mov == true){
                    element.Movies = payload.Data;
                    element.Movies.forEach(movie => {
                        movie.CinemaId = element.CinemaID;
                    })
                    element.mov = false;
                }
                else if(element.Movies != undefined){
                    element.Movies.length = 0;
                }
            });
            return state;
        }
    },
    {
        action: getProjections.request,
        reduce: (state : ICinemaSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getProjections.response,
        reduce: (state : ICinemaSearchState, payload: any) => {
            state.cinemaResult.forEach(element => {
                if(element.CinemaID == payload.Data[0].CinemaID){
                    element.Movies.forEach(movie => {
                        if(movie.ImdbID == payload.Data[0].ImdbID){
                            movie.Projections = payload.Data;
                            for(var i = 0; i < payload.Data.length; i++){
                                movie.Projections[i].date = payload.Data[i].Date;
                            }
                        }
                    })
                }
            })
        }
    },
    {
        action: getLocationForInfo.request,
        reduce: (state : ICinemaSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getLocationForInfo.response,
        reduce: (state : ICinemaSearchState, payload: any) => {
            longitude = payload.location.lng; 
            latitude = payload.location.lat;
            getCityNameByLocation();
        }
    },
    {
        action: getCityName.request,
        reduce: (state : ICinemaSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getCityName.response,
        reduce: (state : ICinemaSearchState, payload: any) => {
            state.myCity = payload.address.city;
        }
    }
],initialState);

function getLocation(){
    setTimeout(function(){
        app.dispatch(cinemaMovieSearchLocation.payload({template:{longitude: longitude, latitude: latitude}}));
    }, 3000);
}

function getCityNameByLocation(){
    setTimeout(function(){
        app.dispatch(getCityName.payload({query: {format: "json", lat: latitude, lon: longitude}}));
    }, 3000);
}
