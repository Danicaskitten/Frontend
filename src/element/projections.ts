import { Element } from 'corky/tags/element';
import template from '../template';
import reservationService from '../service/reservationService';

@template("projection-result", reservationService)
export abstract class ProjectionResult extends Element {
    abstract reserve(projectionId: string);
    reserveProjection(id){
            return function(event){
            this.reserve(id);
        }
    }
}

