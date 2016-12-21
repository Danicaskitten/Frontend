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

    advancedSearch() {
        dateFromForm = (<HTMLInputElement>document.getElementById("datepicker")).value;
        dateFromForm = dateFromForm.trim();
        today = getStringFromDate();

        var isChecked = (<HTMLInputElement>document.getElementById('search-option')).checked;
        if (isChecked){
            getLocationFromGoogle();
        }
        else{
            var city = (<HTMLInputElement>document.getElementById("city-input")).value;
            city = city.trim();
            if(city !== "" && city !== undefined && city !== null)
                getLocation(city);
        }
    }
}

var dateFromForm = "";
var today = "";

var onSuccess = function(position) {
    app.dispatch(advancedMovieSearchLocation.payload({template:{longitude: position.coords.longitude, latitude: position.coords.latitude}, query: {StartDate: today, EndDate: dateFromForm}}));
}

function onError(error){
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

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