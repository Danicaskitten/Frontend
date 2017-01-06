import Flux from 'corky/flux';
import { app } from '../main';


export interface ISearchState {
    query: string;
    movieResult: Array<ISearchMovie>
}

var initialState: ISearchState = {
    query: "",
    movieResult: []

};

export interface ISearchMovie {
    Title: string,
    ImdbID: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string
}

export const searchMovieByTitle = new Flux.RequestAction<{ template: { title: string } }, any>("SEARCH_MOVIE", "https://moviebot-rage.azurewebsites.net/api/v2/movies/title/{title}", "GET");

export var searchReducer = new Flux.Reducer<ISearchState>([
    {
        action: searchMovieByTitle.request,
        reduce: (state: ISearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
        }
    },
    {
        action: searchMovieByTitle.response,
        reduce: (state: ISearchState, payload: any) => {
            state.movieResult = payload.Data;
        }
    }
], initialState); 
