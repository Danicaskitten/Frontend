import { Element } from 'corky/tags/element';
import template from '../template';
import searchService from '../service/searchService';
import { ISearchMovieResult, ISearchMovieData} from '../ducks/searchDuck';
import { app } from '../main';

@template("search-view", searchService)
export abstract class SearchView extends Element {
    result: Array<ISearchMovieData>;
    moviesTitles: Array<ISearchMovieResult>;
    active: boolean;
    abstract basicMovieSearch(title);

    search() {
        var movie = (<HTMLInputElement>document.getElementById("search-input")).value;
        movie = movie.trim();
        if (movie !== "" && movie !== undefined && movie !== null) {
            this.basicMovieSearch(movie);
        }
    }
    redirectToAdvancedSearch() {
        this.router.redirect('/advancedSearch');
    }
    redirectToCinemaSearch() {
        this.router.redirect('/cinemaSearch');
    }
    redirectToSearch() {
        this.router.redirect('/search');
    }
}