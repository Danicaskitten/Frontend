import { Element } from 'corky/tags/element';
import template from '../template';
import profileService from '../service/profileService';


@template("profile", profileService)
export abstract class Profile extends Element {
        username: string;
        abstract sendGenres (genres: Array<number>);
        abstract changePass(old: string, newP: string,confirm: string);
        genresOpen: boolean = true;

        saveChanges(){ 
                var arrayOfTrue = [];
                for(var i = 1 ; i < 7; i++){
                        if((<HTMLInputElement> document.getElementById("checkbox-" + i)).checked === true){
                                arrayOfTrue.push(i);
                        }
                }
                this.sendGenres(arrayOfTrue);
        }
        seeGenres(){
                this.genresOpen = true;
        }
        seePassword(){
                this.genresOpen = false;
        }
        confirmPasswordChange(){
                 var old = (<HTMLInputElement>document.getElementById("old-pass")).value;
                 var newP = (<HTMLInputElement>document.getElementById("new-pass")).value;
                 var confirm = (<HTMLInputElement>document.getElementById("confirm-new-pass")).value;
                 this.changePass(old,newP,confirm);
        }
}