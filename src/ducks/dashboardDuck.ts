import Flux from 'corky/flux';
import {app} from '../main';

export interface IDashboardState {
    dashboard: {
        result: Array<ISuggestion>
    }
}

export interface IImdbResult {
    id: string;
    description: string;
    image: string;
}

//dummy data
var timeAndLoc: ITimeAndLocation = {
    location: "Cinestar Zagreb",
    time: ["4:30"],
}

var timeAndLoc2: ITimeAndLocation = {
    location: "Rijeka",
    time: ["6:30"],
}

var initialState: IDashboardState = {
    dashboard: {
        result: []
    }
}

var emptyImdbRresult: IImdbResult = {
    id: "",
    image: "",
    description: ""
}

export interface ISuggestion {
    id: string,
    title: string,
    url: string,
    description: string,
    runtime: string,
    genre: string,
    timeAndLocation: Array<ITimeAndLocation>
}

export interface ITimeAndLocation {
    location: string,
    time: Array<string>,
}

export interface ITimeAndLocationArrayResponse {
    Data: Array<{
        Cinema: {
            Name: string;
            City: string;
        },
        Projections: Array<{
            Date: string;
            Time: string;
        }>,
        ImdbID: string;
    }>
}

export interface IDashboardResponse {
    Title: string,
    ImdbDb: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string
}

export interface IDashboardArrayResponse {
    Data: Array<{
        Title: string,
        ImdbDb: string,
        Poster: string,
        Runtime: string,
        Plot: string,
        Genre: string
    }>
}

export interface IImdbResponse {
    data: {
        id: string;
        description: string;
        image: string;
    }
}

export interface ImdbRe {
    id: string;
    description: string;
    image: string;
}

var imdbResponse: IImdbResponse = {
    data: {
        id: "fdsgds",
        description: "fdsfds",
        image: "fdsfds"
    }
}

export const getImageFromImdb = new Flux.RequestAction<any, ImdbRe>("IMAGE_FROM_IMDB","http://imdb.wemakesites.net/api/tt0848228", "GET");
export const getMovies = new Flux.RequestAction<{ query: { title: string } }, Array<IDashboardResponse>>("DASHBOARD_LIFE", "https://moviebot-rage.azurewebsites.net/api/v1/Search/Movie", "GET");
export const getProjections = new Flux.RequestAction<{ query: {imdbid: string} }, Array<ITimeAndLocation>>("TIME_AND_LOCATION","https://moviebot-rage.azurewebsites.net/api/v1/Search/CinemaFromMovie", "GET");

export var dashboardReducer = new Flux.Reducer<IDashboardState>(
    [
        {
            action: getMovies.response,
            reduce: (state: IDashboardState, payload: IDashboardArrayResponse) => {
                state.dashboard.result = payload.Data.map((obj) => {
                    return {
                        id: obj.ImdbDb,
                        url: obj.Poster,
                        title: obj.Title,
                        description: obj.Plot,
                        runtime: obj.Runtime,
                        genre: obj.Genre,
                        timeAndLocation: []
                    }
                });
                return state;
            }
        },
        {
            action: getImageFromImdb.response,
            reduce: (state: IDashboardState, payload: IImdbResponse) => {
                //getImageFromImdb.payload(payload = imdbResponse);
                state.dashboard.result.forEach(element => {
                    if(element.id == payload.data.id){
                        element.description = payload.data.description;
                        element.url = payload.data.image;
                    }
                });
                return state;
            }
        },
        {
            action: getProjections.response,
            reduce: (state: IDashboardState, payload: ITimeAndLocationArrayResponse) => {
                state.dashboard.result.forEach(element => {
                    payload.Data.forEach(payl => {
                        if(element.id == payl.ImdbID){
                            var timeArray = [];
                            payl.Projections.forEach(proj => {
                                timeArray.push(proj.Time);
                            });
                            var tAndL: ITimeAndLocation = {
                                location: payl.Cinema.City + ' ' + payl.Cinema.Name,
                                time: timeArray
                            }
                            element.timeAndLocation.push(tAndL);
                        }
                    })
                });
                return state;
            }
        }
    ], initialState
);

function callImdbRequest(result){
    if(result !== undefined){
        result.forEach(element => {
             app.dispatch(getImageFromImdb.payload({}));
        });
    }
}