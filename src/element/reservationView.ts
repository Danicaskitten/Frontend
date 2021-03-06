import { Element } from 'corky/tags/element';
import template from '../template';
import reservationService from '../service/reservationService';

@template("reservation-view", reservationService)
export abstract class ReservationView extends Element {
    reservation:any;
    abstract setPosition(verticalSeat: number, horizontalSeat: number);
    abstract confirmReservation(confirm: boolean);
    abstract completeReservation();
    abstract cancelReservation();
    abstract setSeatNumber(seats: number);

    set(ver,hor){
        return function(e){
            this.setPosition(ver,hor);
        }
    }
    seats = function(e){
        try {
            var value =parseInt((<HTMLInputElement>document.getElementById("reservation-seats")).value);
            this.setSeatNumber(value);
        } catch (error) { 
            
        }       
    }.bind(this);
    confirm(value){
        return function(e){
            this.confirmReservation(value);
            if(value === true){                
                this.completeReservation();
                 this.router.redirect('/reservationHistory')
            }
            else{
                this.cancelReservation();
                 this.router.redirect('/dashboard')

            }
            
        }
    }
}
