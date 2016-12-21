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
        this.showAdditional = false;
    }

    active: number;
    username: string;
    userurl: string;
    showMenu:boolean;
    showAdditional:boolean;
    closeMenus(){
        this.showAdditional = false;
        this.showMenu = false;
    }

    toggleMenu(){
        this.showMenu = !this.showMenu;
    }
    toggleAdditional(){
        this.showAdditional = !this.showAdditional;
    }

    redirectToDashboard() { 
        this.router.redirect('/dashboard');
        this.closeMenus();
      
    }
    redirectToLogout(){
        this.router.redirect('/logout');
        this.closeMenus();
    }

    redirectToSearch() {
        this.router.redirect('/search');
        this.closeMenus();
    }

    redirectToChat() {
        this.router.redirect('/chat');
        this.closeMenus();
    }
     redirectToProfile() {
        this.router.redirect('/profile');
        this.closeMenus();
    }
    redirectToAdvancedSearch() {
        this.router.redirect('/advancedSearch');
        this.closeMenus();
    }
    redirectToCinemaSearch() {
        this.router.redirect('/cinemaSearch');
        this.closeMenus();
    }
}

