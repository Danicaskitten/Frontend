import { Element } from 'corky/tags/element';
import template from '../template';
import appService from '../service/appService';
import './navigation';
import './chat';
import './chatReply';
import './chatView';
import './searchView';
import './dashboard';
import './timeAndLocation';
import './dashboardResult';
import './searchResult';


@template("app", appService)
export abstract class AppContainer extends Element {

}