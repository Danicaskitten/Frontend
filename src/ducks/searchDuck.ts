import Flux from 'corky/flux';
import { app } from '../main';

export interface ISearchState {
    query: string;
    result: Array<ISearchMovie>
}

var initialState: ISearchState = {
    query: "",
    result: []

};

export interface ISearchMovie {
    Title: string,
    ImdbID: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string
}


export const searchMovieByTitle = new Flux.RequestAction<{ query: { title: string; } }, {"Data": Array<ISearchMovie>}>("SEARCH_MOVIE", "https://moviebot-rage.azurewebsites.net/api/v2/movies/title/{title}/", "GET");


export var searchReducer = new Flux.Reducer<ISearchState>([
    {
        action: searchMovieByTitle.request,
        reduce: (state: ISearchState, payload: {"Data": Array<ISearchMovie>}) => {
            state.result = payload.Data;

        }
    }
], initialState);
