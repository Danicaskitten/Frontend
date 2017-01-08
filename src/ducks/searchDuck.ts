import Flux from 'corky/flux';
import { app } from '../main';


export interface ISearchState {
    query: string;
    movieDataResult: Array<ISearchMovieData>;
}

var initialState: ISearchState = {
    query: "",
    movieDataResult: [],
}

export interface ISearchMovieData {
    Title: string,
    Year: string,
    Rated: string,
    Released: string,
    Runtime: string,
    Genre: string,
    Director: string,
    Writer: string,
    Actors: string,
    Plot: string,
    Language: string,
    Country: string,
    Awards: string,
    Poster: string,
    Metascore: string,
    imdbRating: string,
    imdbVotes: string,
    imdbID: string,
    Type: string,
    Response: string
}

export interface ISearchMovieResult {
    Title: string,
    Year: string,
    imdbID: string,
    Type: string,
    Poster: string
}

var movieResult = Array<ISearchMovieResult>();

export const searchMovieByTitle = new Flux.RequestAction<{ template: { title: string } }, any>("SEARCH_MOVIE_TITLE", "http://www.omdbapi.com/?s={title}", "GET");
export const searchMovieByData = new Flux.RequestAction<{ template: { title: string } }, any>("SEARCH_MOVIE_DATA", "http://www.omdbapi.com/?t={title}", "GET");

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
            movieResult = payload.Search;
            state.movieDataResult = [];
        }
    },
    {
        action: searchMovieByData.request,
        reduce: (state: ISearchState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
        }
    },
    {
        action: searchMovieByData.response,
        reduce: (state: ISearchState, payload: any) => {
            state.movieDataResult.push(payload);
        }
    }
], initialState);

export function getMovieByData() {
    for (var i = 0; i < movieResult.length; i++) {
        console.log(movieResult[i].Title);
        app.dispatch(searchMovieByData.payload({ template: { title: movieResult[i].Title } }));
    }
}
