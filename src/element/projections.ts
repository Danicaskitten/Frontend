import { Element } from 'corky/tags/element';
import template from '../template';
import reservationService from '../service/reservationService';

@template("projection-result", reservationService)
export abstract class ProjectionResult extends Element {
    abstract reservationProcess(projectionId : string);
    abstract reserve(city: string, cinema: string, date: Date, movie: string, projectionId: string,time:string);

    reserveProjection(city, cinema, date, movie, projectionId,time){
        return function(event){
            this.reserve(city, cinema, date, movie, projectionId,time);
            this.reservationProcess(projectionId);
            this.router.redirect("/reserve");
        }
    }
}

