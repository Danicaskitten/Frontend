import { Element } from 'corky/tags/element';
import template from '../template';
import {app} from '../main';
import {IDashboardResponse} from '../ducks/dashboardDuck';
import {getCinemasFromMovie, getProjectionsFromCinema} from '../ducks/advancedSearchDuck';
import {IProjection} from '../ducks/cinemaSearchDuck';

@template("cinema-result-advanced", null)
export abstract class SearchResult extends Element {
    Name: string;
    CinemaID: string;
    Address: string;
    Latitude: string;
    Longitude: string;
    PhoneNumber: string;
    Region: string;
    Province: string;
    City: string;
    hide: boolean;
    Projections: Array<IProjection>

    constructor(opts){
        super();
        this.Name = opts.Name;
        this.CinemaID = opts.CinemaID;
        this.Address = opts.Address;
        this.Latitude = opts.Latitude;
        this.Longitude = opts.Longitude;
        this.PhoneNumber = opts.PhoneNumber;
        this.Region = opts.Region;
        this.Province = opts.Province;
        this.City = opts.City;
        this.hide = true;
        this.Projections = [];
    }

    searchProjectionsAdvanced(id){
            return function(event){
            this.searchProjectionsAdvancedRequest(id);
        }
    }

    searchProjectionsAdvancedRequest(imdbId){
        event.stopPropagation();
        this.hide = !this.hide;
        if(!this.hide){
            app.dispatch(getProjectionsFromCinema.payload({template: { cinemaId: this.CinemaID, imdbId: imdbId},query:{StartDate: "12/10/2016", EndDate: "12/14/2017"}}));
        }
        else{
            this.Projections.length = 0;
        }        
    }
}