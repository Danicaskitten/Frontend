import { Element } from 'corky/tags/element';
import template from '../template';
import searchService from '../service/searchService';
import {ISearchMovieResult} from '../ducks/searchDuck';


@template("search-view",searchService)
export abstract class SearchView extends Element {
    result: Array<ISearchMovieResult>;
    active: boolean;

    search() { 
        var value = (<HTMLInputElement>document.getElementById("search-input")).value;
        value = value.trim();
        if(value !== "" && value!== undefined && value !== null)
            this.router.redirect('/search/' + encodeURI(value));
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