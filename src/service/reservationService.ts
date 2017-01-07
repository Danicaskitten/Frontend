import { Service } from 'corky/flux/service';
import { IModel } from '../model';
import { setReservation,confirmReservation,setPosition,setSeatNumber } from '../ducks/reservationDuck';

export class ReservationService extends Service {
    selector =
    (state: IModel) => (
        {
            reservations: state.reservation.reservations.map((reservation) => {
                return {
                    city: reservation.city,
                    movie: reservation.movie,
                    cinema: reservation.cinema,
                    seatNumber: reservation.numberOfSeats,
                    pricePerTicket: reservation.pricePerSeat,
                    date: reservation.date
                }
            }),
            reservation: state.reservation.reservation ?
                {
                    city: state.reservation.reservation.city,
                    movie: state.reservation.reservation.movie,
                    cinema: state.reservation.reservation.cinema,
                    seatNumber: state.reservation.reservation.numberOfSeats,
                    pricePerTicket: state.reservation.reservation.pricePerSeat,
                    date: state.reservation.reservation.date,
                    freeSeats: state.reservation.reservation.freeSeats,
                    numberOfSeats: state.reservation.reservation.numberOfSeats,
                    positionVertical: <number>state.reservation.reservation.positionVertical,
                    positionHorisontal: <number> state.reservation.reservation.positionHorisontal
                } : {
                    cinema: "",
                    city: "",
                    date: "",
                    movie: "",
                    projectionId: -1,
                    pricePerSeat: 0,
                    freeSeats: 0,
                    numberOfSeats: 0,
                    positionVertical: 0,
                    positionHorisontal: 0
                }
        }
    )
    actions = {
        reserve: (city: string, cinema: string, date: Date, movie: string, projectionId: string, time: string) => setReservation.payload({
            city: city,
            cinema: cinema,
            date: date,
            movie: movie,
            projectionId: projectionId,
            time: time
        }),
        setPosition:(verticalSeat: number, horizontalSeat: number)=> setPosition.payload({vertical:verticalSeat,horizontal:horizontalSeat}),
        confirmReservation:(confirm: boolean)=> confirmReservation.payload({confirm: confirm}),
        setSeatNumber: (seats: number)=>setSeatNumber.payload({seats: seats})
    };
}

var reservationService = new ReservationService();

export default reservationService;