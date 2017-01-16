import Flux from 'corky/flux';
import {app} from '../main';
import {ICinemaSearchMovieResult, IProjection} from './cinemaSearchDuck';

export interface IAdvancedSearchMovieResult{
    Title: string,
    ImdbID: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string,
    Cinemas: Array<ICinemaSearchProjectionsResult>,
    cin: boolean
}

export interface ICinemaSearchProjectionsResult{
    Name: string,
    CinemaID: string,
    Address: string,
    Latitude: string,
    Longitude: string,
    PhoneNumber: string,
    Region: string,
    Province: string,
    City: string,
    Projections: Array<IProjection>,
    mov: boolean,
    movieName: string
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
    query: string,
    result: Array<IAdvancedSearchMovieResult>,
    myCity: string,
    latitude: string,
    longitude: string,
    startDate: string,
    endDate: string,
    title: string
}

var initialState : IAdvancedSearchState = {
    query: "",
    result: [],
    myCity: "",
    latitude: "",
    longitude: "",
    startDate: "",
    endDate: "",
    title: ""
};

var latitude = "";
var longitude = "";
var startDate = "";
var endDate = "";
var title = "";

export const advancedMovieSearchLocation = new Flux.RequestAction<{template:{longitude: string, latitude: string}, query: { StartDate: string, EndDate: string;}}, any>("ADVANCE_SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v2/movies/near/{latitude}/{longitude}/", "GET");
export const getLocationFromOSMAdvanced = new Flux.RequestAction<{template: {city: string}}, any>("GET_LOCATION_ADVANCED", "http://nominatim.openstreetmap.org/search/{city}?format=json", "GET");
export const getLocationFromGoogleApi = new Flux.RequestAction<{query: {key: string}}, any>("GET_LOCATION_GOOGLE_ADVANCED", "https://www.googleapis.com/geolocation/v1/geolocate", "POST");
export const getLocationForInfoAdvanced = new Flux.RequestAction<{query: {key: string}}, any>("GET_LOCATION_FOR_INFO_ADVANCED", "https://www.googleapis.com/geolocation/v1/geolocate", "POST");
export const getCityNameAdvanced = new Flux.RequestAction<{query: {format: string, lat: string, lon: string}}, any>("GET_CITY_NAME_ADVANCED", "http://nominatim.openstreetmap.org/reverse", "GET");
export const getCinemasFromMovie = new Flux.RequestAction<{template: {imdbId: string, latitude: string, longitude: string}, query: {StartDate: string, EndDate:string}}, any>("GET_CINEMAS_FROM_MOVIE", "https://moviebot-rage.azurewebsites.net/api/v2/movies/id/{imdbId}/cinemas/{latitude}/{longitude}/", "GET");
export const getMoviesFromTitle = new Flux.RequestAction<{template: {title: string, latitude: string, longitude: string}, query: {StartDate: string, EndDate: string}}, any>("GET_MOVIES_BY_TITLE", "http://moviebot-rage.azurewebsites.net/api/v2/movies/title/{title}/{latitude}/{longitude}/", "GET")
export const setDate = new Flux.Action<{ dateFrom: string, dateTo: string }>("SET_DATE");
export const getProjectionsFromCinema = new Flux.RequestAction<{template:{cinemaId: string, imdbId: string},query:{ StartDate:string, EndDate:string}}, any>("GET_PROJECTIONS_CINEMA", "http://moviebot-rage.azurewebsites.net/api/v2/projections/list/{imdbId}/{cinemaId}", "GET");
export const setTitle = new Flux.Action<{title: string}>("SET_TITLE");
export const getMoviesJustFromTitle = new Flux.RequestAction<{template: {title: string}}, any>("GET_JUST_TITLE", "http://moviebot-rage.azurewebsites.net/api/v2/movies/title/{title}/", "GET");

export var advancedSearchReducer = new Flux.Reducer<IAdvancedSearchState>([
    {
           action: getMoviesFromTitle.request,
           reduce: (state: IAdvancedSearchState, payload: any) => {
               payload.options = {};
               payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
           }
       },
    {
        action: getMoviesFromTitle.response,
        reduce: (state: IAdvancedSearchState, payload: any) => {
            state.result = payload.Data;
        }
    },
    {
           action: getMoviesJustFromTitle.request,
           reduce: (state: IAdvancedSearchState, payload: any) => {
               payload.options = {};
               payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
           }
       },
    {
        action: getMoviesJustFromTitle.response,
        reduce: (state: IAdvancedSearchState, payload: any) => {
            state.result = payload.Data;
        }
    },
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
            state.latitude = payload[0].lat;
            state.longitude = payload[0].lon;
            startDate = state.startDate;
            endDate = state.endDate;
            title = state.title;
            if (title !== "" && title !== undefined && title !== null){
                movieFromTitle();
            }
            else{
                getLocation();
            }
        }
    },
    {
        action: setDate,
        reduce: (state: IAdvancedSearchState, payload: { dateFrom: string, dateTo: string }) => {
            state.endDate = payload.dateTo;
            state.startDate = payload.dateFrom;
        }
    },
    {
        action: setTitle,
        reduce: (state: IAdvancedSearchState, payload: { title: string }) => {
            state.title = payload.title;
        }
    },
    {
        action: getLocationFromGoogleApi.request,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getLocationFromGoogleApi.response,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            longitude = payload.location.lng; 
            latitude = payload.location.lat;
            state.longitude = payload.location.lng;
            state.latitude = payload.location.lat;
            getLocation();
        }
    },
    {
        action: getLocationForInfoAdvanced.request,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getLocationForInfoAdvanced.response,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            longitude = payload.location.lng; 
            latitude = payload.location.lat;
            state.longitude = payload.location.lng;
            state.latitude = payload.location.lat;
            getCityNameByLocation();
        }
    },
    {
        action: getCityNameAdvanced.request,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getCityNameAdvanced.response,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            state.myCity = payload.address.city;
            if(state.myCity === undefined) {
                state.myCity = payload.address.town;
            }
        }
    },
    {
        action: getProjectionsFromCinema.request,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getProjectionsFromCinema.response,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            state.result.forEach(element => {
                if(element.ImdbID == payload.Data[0].ImdbID){
                    element.Cinemas.forEach(cinema => {
                        if(cinema.CinemaID == payload.Data[0].CinemaID){
                            cinema.Projections = payload.Data;
                            for(var i = 0; i < payload.Data.length; i++){
                                cinema.Projections[i].date = payload.Data[i].Date;
                                cinema.Projections[i].cinemaName = cinema.Name;
                                cinema.Projections[i].City = cinema.City;
                                cinema.Projections[i].movieName = cinema.movieName;
                            }
                        }
                    })
                }
            })
        }
    },
    {
        action: getCinemasFromMovie.request,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            state.result.forEach(element => {
                if(element.ImdbID == payload.template.imdbId){
                    element.cin = true;
                }
            });
            var imdb = payload.template.imdbId;
            payload.template = {imdbId: imdb, longitude: state.longitude, latitude: state.latitude};
            payload.query = {StartDate: state.startDate, EndDate: state.endDate};
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded;  charset=utf-8";
        }
    },
    {
        action: getCinemasFromMovie.response,
        reduce: (state : IAdvancedSearchState, payload: any) => {
            state.result.forEach(element => {
                if(element.cin == true){
                    element.Cinemas = payload.Data;
                    element.cin = false;
                    element.Cinemas.forEach(cinema => {
                        cinema.movieName = element.Title;
                    })
                }
                else if(element.Cinemas != undefined){
                    element.Cinemas.length = 0;
                }
            });
            return state;
        }
    }
],initialState);

function getLocation(){
    setTimeout(function(){
        app.dispatch(advancedMovieSearchLocation.payload({template:{longitude: longitude, latitude: latitude}, query: {StartDate: startDate, EndDate: endDate}}));
    }, 500);
}

function movieFromTitle(){
    setTimeout(function(){
        app.dispatch(getMoviesFromTitle.payload({template:{title: title, longitude: longitude, latitude: latitude}, query: {StartDate: startDate, EndDate: endDate}}));
    }, 500);
}

function getCityNameByLocation(){
    setTimeout(function(){
        app.dispatch(getCityNameAdvanced.payload({query: {format: "json", lat: latitude, lon: longitude}}));
    }, 500);
}

function getCityMovieProjection(){
    setTimeout(function(){
        app.dispatch(getCityNameAdvanced.payload({query: {format: "json", lat: latitude, lon: longitude}}));
    }, 500);
}