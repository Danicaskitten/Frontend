import { Element } from 'corky/tags/element';
import template from '../template';
import searchService from '../service/searchService';
import { ISearchMovie } from '../ducks/searchDuck';
import { app } from '../main';

@template("search-view", searchService)
export abstract class SearchView extends Element {
    result: Array<ISearchMovie>

    search() {
        var value = (<HTMLInputElement>document.getElementById("search-input")).value;
        value = value.trim();
        if (value !== "" && value !== undefined && value !== null)
            this.router.redirect('/search/' + encodeURI(value));
    }
}