import { Element } from 'corky/tags/element';
import template from '../template';
import appService from '../service/appService';

export interface INavigation{
    active: number;
}

@template("navigation", appService)
export abstract class Navigation extends Element implements INavigation {
    
    constructor() {
        super();
        this.showMenu = false;
    }

    active: number;
    username: string;
    userurl: string;
    showMenu:boolean;

    toggleMenu(){
        this.showMenu = ! this.showMenu;
    }

    redirectToDashboard() {
        this.router.redirect('/dashboard');
        this.showMenu = false;
    }

    redirectToSearch() {
        this.router.redirect('/search');
         this.showMenu = false;
    }

    redirectToChat() {
        this.router.redirect('/chat');
         this.showMenu = false; 
    }
     redirectToProfile() {
        this.router.redirect('/profile');
         this.showMenu = false; 
    }
    redirectToAdvancedSearch() {
        this.router.redirect('/advancedSearch');
        this.showMenu = false;
    }
    redirectToCinemaSearch() {
        this.router.redirect('/cinemaSearch');
        this.showMenu = false;
    }
}

