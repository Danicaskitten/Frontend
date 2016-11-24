import { Element } from 'corky/tags/element';
import template from '../template';
import appService from '../service/appService';
import './navigation';
import './chat';
import './chatReply';
import './chatView';
import './searchView';


@template("app", appService)
export abstract class AppContainer extends Element {

}