import { Element } from 'corky/tags/element';
import template from '../template';
import searchService from '../service/searchService';
import { ISearchMovie, searchMovieByTitle } from '../ducks/searchDuck';
import { app } from '../main';

@template("search-view", searchService)
export abstract class SearchView extends Element {
    movieResult: Array<ISearchMovie>

    search() {
        var movie = (<HTMLInputElement>document.getElementById("search-input")).value;
        movie = movie.trim();
        if (movie !== "" && movie !== undefined && movie !== null)
            app.dispatch(searchMovieByTitle.payload({ template: { title: movie } }));
    }
}