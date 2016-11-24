import { precompiledTags } from './compiledTags';
import { registerElement, registerService } from 'corky/tags/template';

export default function template(template, service?) {
    return (target) => {
        registerElement(target, template, precompiledTags);
        if(service != undefined) registerService(target, service);
    }
}
