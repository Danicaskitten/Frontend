import { Element } from 'corky/tags/element';
import template from '../template';
import advancedSearchService from '../service/advancedSearchService';
import {IAdvancedSearchMovieResult} from '../ducks/advancedSearchDuck';


@template("advanced-search-view",advancedSearchService)
export abstract class AdvancedSearchView extends Element {
    result: Array<IAdvancedSearchMovieResult>

    advancedSearch() {
        var value = (<HTMLInputElement>document.getElementById("city-input")).value;
        value = value.trim();
        if(value !== "" && value !== undefined && value !== null)
            this.router.redirect('/advancedSearch/' + encodeURI(value));
    }
}