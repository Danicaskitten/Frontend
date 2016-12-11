import { Element } from 'corky/tags/element';
import template from '../template';
import profileService from '../service/profileService';


@template("login", profileService)
export abstract class Login extends Element {
        abstract login(email:string, password: string);


        loginUser(){
             var email = (<HTMLInputElement>document.getElementById("login-name")).value;
             var password = (<HTMLInputElement>document.getElementById("login-password")).value;
             this.login(email,password);
             
        }
        redirectToRegister(){
                this.router.redirect("/register");
        }
}