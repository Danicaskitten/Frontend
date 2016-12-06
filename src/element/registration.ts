import { Element } from 'corky/tags/element';
import template from '../template';
import profileService from '../service/profileService';


@template("registration", profileService)
export abstract class Registration extends Element {
        abstract register(email:string, password: string, confirm:string);


        registerUser(){
             var email = (<HTMLInputElement>document.getElementById("registration-name")).value;
             var password = (<HTMLInputElement>document.getElementById("registration-password")).value;
             var confpassword = (<HTMLInputElement>document.getElementById("registration-repeat-password")).value;
             if(password.trim() === confpassword.trim())
             {
                 this.register(email,password,confpassword);
             }
        }
}