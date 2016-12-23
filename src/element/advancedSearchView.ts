import { Element } from 'corky/tags/element';
import template from '../template';
import advancedSearchService from '../service/advancedSearchService';
import {IAdvancedSearchMovieResult} from '../ducks/advancedSearchDuck';
import {app} from '../main';
import {advancedMovieSearchLocation, getLocationFromOSMAdvanced, getLocationFromGoogleApi} from '../ducks/advancedSearchDuck';
import {mapKey} from '../config';

@template("advanced-search-view",advancedSearchService)
export abstract class AdvancedSearchView extends Element {
    result: Array<IAdvancedSearchMovieResult>
    myCity: string

    advancedSearch() {
        dateFromForm = (<HTMLInputElement>document.getElementById("datepicker")).value;
        dateFromForm = dateFromForm.trim();
        today = getStringFromDate();
        var city = "";

        var isChecked = (<HTMLInputElement>document.getElementById('search-option')).checked;
        if (isChecked){
            var needsParsing = (<HTMLElement>document.getElementById('label-location-advanced')).textContent;
            city = parse(needsParsing);
        }
        else{
            city = (<HTMLInputElement>document.getElementById("city-input")).value;
            city = city.trim();
        }
        if(city !== "" && city !== undefined && city !== null){
            getLocation(city);
        }
    }
}

var dateFromForm = "";
var today = "";

function getLocation(value){
    app.dispatch(getLocationFromOSMAdvanced.payload({template: {city: value}}));
}

function getLocationFromGoogle(){
    app.dispatch(getLocationFromGoogleApi.payload({query: {key: mapKey}}));
}

function getStringFromDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if(dd<10){
        var d ='0'+ dd
    } 
    if(mm<10){
        var m= '0'+ mm
    } 
    var stringDate = mm + '/' + dd+'/' + yyyy;
    return stringDate;
}

function parse(needsParsing){
    needsParsing = needsParsing.replace(/\s*$/, "");
    needsParsing = needsParsing.trim();
    var n = needsParsing.split(" ");
    return n[n.length - 1];
}