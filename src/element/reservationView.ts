import { Element } from 'corky/tags/element';
import template from '../template';
import reservationService from '../service/reservationService';

@template("reservation-view", reservationService)
export abstract class ReservationView extends Element {

    
}
