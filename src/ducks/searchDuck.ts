import Flux from 'corky/flux';

export interface ISearchMovieResult{
    title: string,
    imdb: string,
    poster: string,
    runtime: string,
    plot: string,
    genre: string
}

export interface ISearchState{
    query: string;
    result: Array<ISearchMovieResult>
}

var initialState : ISearchState = {
    query: "",
    result: []
};

export const searchMovieByTitle = new Flux.RequestAction< {query: { title: string;}},any>("SEARCH_MOVIE", "api/v1/Search/Movie", "GET");

export const searchMovieTitleDummy = new Flux.Action<{text: string;}>("SEARCH_MOVIE_DUMMY");


export var searchReducer = new Flux.Reducer<ISearchState>([
    {
        action: searchMovieTitleDummy,
        reduce: (state : ISearchState, payload: {text: string}) => {
            console.log("You searched the title: " +  payload);
            state.result.push({
                title: "Avengers: Infinity war",
                imdb: "njnj",
                poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BOGQ5NTY3NjktYjIzNS00Y2ZjLWIyODQtMjQzYzg1ZTMzOGI5XkEyXkFqcGdeQXVyNDMwMzEyNzA@._V1_UY268_CR43,0,182,268_AL_.jpg",
                runtime: "134 m",
                plot: "oh yeah plot",
                genre: "Action, Sci-Fi"
            });
        }
    }
],initialState);
