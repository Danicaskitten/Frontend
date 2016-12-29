import { Element } from 'corky/tags/element';
import template from '../template';
import {app} from '../main';
import {IDashboardResponse} from '../ducks/dashboardDuck';
import {getCinemasFromMovie} from '../ducks/advancedSearchDuck';

@template("cinema-result-advanced", null)
export abstract class SearchResult extends Element {
}