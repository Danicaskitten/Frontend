import { Element } from 'corky/tags/element';
import template from '../template';
import advancedSearchService from '../service/advancedSearchService';
import {IAdvancedSearchMovieResult} from '../ducks/advancedSearchDuck';
import {app} from '../main';
import {advancedMovieSearchLocation, getLocationFromOSMAdvanced, getLocationFromGoogleApi, setDate, setTitle, getMoviesJustFromTitle} from '../ducks/advancedSearchDuck';
import {mapKey} from '../config';

@template("advanced-search-view",advancedSearchService)
export abstract class AdvancedSearchView extends Element {
    result: Array<IAdvancedSearchMovieResult>
    myCity: string
    startDate: string
    endDate: string
    title: string

    advancedSearch() {
        dateFromForm = (<HTMLInputElement>document.getElementById("datepicker")).value;
        dateFromForm = dateFromForm.trim();
        if (dateFromForm !== "" && dateFromForm !== undefined){
            var date = new Date(dateFromForm);
            date.setDate(date.getDate() + 1);
            dateTo = getStringFromDate(date);
        }
        else {
            dateTo = "";
        }
        var title = (<HTMLInputElement>document.getElementById("title-input")).value;
        title = title.trim();
        app.dispatch(setDate.payload({dateFrom: dateFromForm, dateTo: dateTo}));
        app.dispatch(setTitle.payload({title: title}));
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
        else {
            if(title !== "" && title !== undefined && title !== null){
                app.dispatch(getMoviesJustFromTitle.payload({template: {title: title}}));
            }
        }
    }
}

var dateFromForm = "";
var dateTo = "";

function getLocation(value){
    app.dispatch(getLocationFromOSMAdvanced.payload({template: {city: value}}));
}

function getLocationFromGoogle(){
    app.dispatch(getLocationFromGoogleApi.payload({query: {key: mapKey}}));
}

function getStringFromDate(date){
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
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