import Flux from 'corky/flux';

export interface IAdvancedSearchMovieResult{
    Title: string,
    ImdbDb: string,
    Poster: string,
    Runtime: string,
    Plot: string,
    Genre: string
}

export interface IAdvancedSearchState{
    query: string;
    result: Array<IAdvancedSearchMovieResult>
}

var initialState : IAdvancedSearchState = {
    query: "",
    result: []
};

export const advancedMovieSearch = new Flux.RequestAction< {query: { title: string;}},{"Data": Array<IAdvancedSearchMovieResult>}>("SEARCH_MOVIE", "http://moviebot-rage.azurewebsites.net/api/v1/Search/Movie", "GET");

export var advancedSearchReducer = new Flux.Reducer<IAdvancedSearchState>([
    {
      action: advancedMovieSearch.request,
      reduce: (state: any, payload: any) => {
          
      }  
    },
    {
        action: advancedMovieSearch.response,
        reduce: (state : IAdvancedSearchState, payload:{"Data": Array<IAdvancedSearchMovieResult>}) => {
            state.result = payload.Data;
        }
    }
],initialState);
