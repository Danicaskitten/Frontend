import Flux from 'corky/flux';
import { app } from '../main';


export interface ISearchState {
    query: string;
    movieDataResult: Array<ISearchMovieData>;
    loadingBasicSearchData: boolean
}

var initialState: ISearchState = {
    query: "",
    movieDataResult: [],
    loadingBasicSearchData: false
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

var movieResult : Array<ISearchMovieData> =[];
export const searchMovieByTitle = new Flux.RequestAction<{ template: { title: string } }, any>("SEARCH_MOVIE_TITLE", "http://www.omdbapi.com/?s={title}&type=movie", "GET");
export const searchMovieByData = new Flux.RequestAction<{ template: { title: string } }, any>("SEARCH_MOVIE_DATA", "http://www.omdbapi.com/?t={title}&tomatoes=true", "GET");

export var searchReducer = new Flux.Reducer<ISearchState>([
    {
        action: searchMovieByTitle.request,
        reduce: (state: ISearchState, payload: any) => {
            payload.options = {};
            movieResult = [];
            state.loadingBasicSearchData = true;
            payload.options["Content-Type"] = "application/x-www-form-urlencoded";
        }
    },
    {
        action: searchMovieByTitle.response,
        reduce: (state: ISearchState, payload: any) => {
            state.movieDataResult = [];
            movieResult = payload.Search;
            getMovieByData();
        }
    },
    
    {
        action: searchMovieByData.response,
        reduce: (state: ISearchState, payload: any) => {
            state.loadingBasicSearchData = false;
            state.movieDataResult.push(payload);
        }
    }
], initialState);

function getMovieByData() {
    for (var i = 0; i < movieResult.length; i++) {
        var payload = { template: { title: movieResult[i].Title }, options: {} };
        payload.options["Content-Type"] = "application/x-www-form-urlencoded";
        console.log(movieResult[i].Title);
        app.dispatch(searchMovieByData.payload(payload));
        
    }
}
