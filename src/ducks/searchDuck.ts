import Flux from 'corky/flux';

export interface ISearchMovieResult{
    Title: string,
    ImdbDb: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string
}

export interface ISearchState{
    query: string;
    result: Array<ISearchMovieResult>
}

var initialState : ISearchState = {
    query: "",
    result: []
};

export const searchMovieByTitle = new Flux.RequestAction< {query: { title: string;}},{"Data": Array<ISearchMovieResult>}>("SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v1/Search/Movie", "GET");

export const searchMovieTitleDummy = new Flux.Action<{text: string;}>("SEARCH_MOVIE_DUMMY");


export var searchReducer = new Flux.Reducer<ISearchState>([
    {
      action: searchMovieByTitle.request,
      reduce: (state: any, payload: any) => {
          
      }  
    },
    {
        action: searchMovieByTitle.response,
        reduce: (state : ISearchState, payload:{"Data": Array<ISearchMovieResult>}) => {
            state.result = payload.Data;
            
        }
    }
],initialState);
