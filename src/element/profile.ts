import { Element } from 'corky/tags/element';
import template from '../template';
import profileService from '../service/profileService';


@template("profile", profileService)
export abstract class Profile extends Element {
        username: string;
        abstract sendGenres (genres: Array<number>)

        saveChanges(){ 
                var arrayOfTrue = [];
                for(var i = 1 ; i < 7; i++){
                        if((<HTMLInputElement> document.getElementById("checkbox-" + i)).checked === true){
                                arrayOfTrue.push(i);
                        }
                }
                this.sendGenres(arrayOfTrue);
        }
}