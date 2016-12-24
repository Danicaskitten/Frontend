import { Service } from 'corky/flux/service';
import {IModel} from '../model';

export class ReservationService extends Service {
    selector =
    (state: IModel) => (
        {
          reservations: state.reservation.reservations.map((reservation)=> {
              return {
                  city: reservation.city,
                  movie: reservation.movie,
                  cinema: reservation.cinema,
                  seatNumber: reservation.numberOfSeats,
                  pricePerTicket: reservation.pricePerSeat,
                  date: reservation.date
              }
          })
        }
    );
    actions = {
        
    }
}

var reservationService = new ReservationService();

export default reservationService;