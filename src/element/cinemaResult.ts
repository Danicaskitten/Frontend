import { Element } from 'corky/tags/element';
import template from '../template';
import {app} from '../main';
import {IDashboardResponse} from '../ducks/dashboardDuck';
import {getMovies} from '../ducks/cinemaSearchDuck';

@template("cinema-result", null)
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
    Movies: Array<IDashboardResponse>

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
        this.Movies = [];
    }

    changeVisibility(event){
        this.hide = !this.hide;
        if(!this.hide){
            app.dispatch(getMovies.payload({ template: { cinemaId: this.CinemaID},query:{StartDate: "12/10/2016", EndDate: "12/14/2017"}}));
        }
        else{
            this.Movies.length = 0;
        }
    }  
}