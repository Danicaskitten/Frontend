import { Element } from 'corky/tags/element';
import template from '../template';
import profileService from '../service/profileService';


@template("profile", profileService)
export abstract class Profile extends Element {
        username: string;
}