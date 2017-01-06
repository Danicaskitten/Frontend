import Flux from 'corky/flux';
import {ConditionalRequestAction} from '../flux/conditional';
import {loginUser, logoutUser, readStorage} from './appDuck';
export enum ISeatPositionHorizontal{
    Left,
    Right,
    Center
}

export enum ISeatPositionVertical{
    Up,
    Down,
    Middle
}



export interface IReservation{
     city: string, 
     cinema: string,
     date: Date,
     movie: string,
     numberOfSeats: number,
     positionVertical: ISeatPositionVertical,
     positionHorisontal: ISeatPositionHorizontal,
     pricePerSeat: number 
}
export interface ISeatNumberPayload{
    "Data":{
        "ProjectionId": number,
        "FreeSeats": number
    }
}

export interface IReservationState {
    reservations: Array<IReservation>,
    token:string,
    username: string,
    reservation: {
        FreeSeats:number,
        ProjectionId: number
    }
}
export const addReservation = new Flux.RequestAction<{template:{ProjectionId: string},options:any}, any>
("ADD_RESERVATION", "http://moviebot-rage.azurewebsites.net/api/v2/reservations/add/{ProjectionId}", "POST");

export const reservation = new ConditionalRequestAction<{template:{ProjectionId:string},options:any},any>
("CHECK_AND_RESERVE","http://moviebot-rage.azurewebsites.net/api/v2/getFreeSeats/{ProjectionId}",
  "GET",addReservation,function(data: ISeatNumberPayload){
    return data.Data.ProjectionId > 0;
});

var initialState : IReservationState = {
    reservation:{FreeSeats:0,ProjectionId:0},
    username:"",
    token: "",
    reservations: [
        {
            city: "Zagreb",
            cinema: "Cinestar Branimir centar",
            date: new Date(),
            movie: "Avengers 3",
            numberOfSeats: 5,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 3

        },
         {
            city: "Milano",
            cinema: "Cinema Orfeo",
            date: new Date(),
            movie: "Avengers 2",
            numberOfSeats: 10,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 10

        }, 
        {
            city: "Split",
            cinema: "Cinestar Joker",
            date: new Date(),
            movie: "Dr. Strange",
            numberOfSeats: 12,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 3

        },
         {
            city: "Rome",
            cinema: "Cinema Orfeo in Rome",
            date: new Date(),
            movie: "Avengers 1",
            numberOfSeats: 1,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 10

        }
    ]
}

export var reservationReducer = new Flux.Reducer<IReservationState>([
     {
        action:logoutUser,
        reduce:(state: IReservationState, payload:any)=>{
            state = initialState;
        }
    },
     {
        action:readStorage,
        reduce:(state: IReservationState, payload:any)=>{
            state.username = localStorage.getItem("user");
            state.token =  localStorage.getItem("token");
        }
    },
     {
        action: loginUser.response,
        reduce: (state: IReservationState, payload: {userName:string,access_token:string}) => {
            state.username = payload.userName;
            state.token = payload.access_token;
        }
    },
    {
        action: reservation.request,
        reduce: (state: IReservationState, payload:any)=>{
             payload.options = {};
              payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
              
             payload.options["Authorization"] = "Bearer " + state.token;
        }
    },
    {
        action: reservation.response,
        reduce: (state: IReservationState, payload:ISeatNumberPayload)=>{
             console.log(payload);
             state.reservation.FreeSeats = payload.Data.FreeSeats;
             state.reservation.ProjectionId = payload.Data.ProjectionId;
        }
    },
     {
        action: addReservation.response,
        reduce: (state: IReservationState, payload:ISeatNumberPayload)=>{
             console.log(payload);
             console.log("DID IT");
        }
    },
    {
        action: addReservation.request,
        reduce: (state: IReservationState, payload:any)=>{
             payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
             payload.options["Authorization"] = "Bearer " + state.token;
        }
    }
],initialState);