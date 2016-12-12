import { Element } from 'corky/tags/element';
import template from '../template';
import advancedSearchService from '../service/advancedSearchService';
import {IAdvancedSearchMovieResult} from '../ducks/advancedSearchDuck';
import {app} from '../main';
import {advancedMovieSearchLocation, getLocationFromBing} from '../ducks/advancedSearchDuck';
import {mapKey} from '../config';


@template("advanced-search-view",advancedSearchService)
export abstract class AdvancedSearchView extends Element {
    result: Array<IAdvancedSearchMovieResult>

    advancedSearch() {
        dateFromForm = (<HTMLInputElement>document.getElementById("datepicker")).value;
        dateFromForm = dateFromForm.trim();
        
        var isChecked = (<HTMLInputElement>document.getElementById('search-option')).checked;
        if (isChecked){
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
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

var onSuccess = function(position) {
    app.dispatch(advancedMovieSearchLocation.payload({template:{longitude: position.coords.longitude, latitude: position.coords.latitude}, query: {StartDate: dateFromForm, EndDate: ""}}));
}

function onError(error){
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

function getLocation(value){
    app.dispatch(getLocationFromBing.payload({query: {query: value, key: mapKey}}));
}
