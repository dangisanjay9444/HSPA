import { TemplateBindingParseResult } from '@angular/compiler';
import {Component, Input} from '@angular/core';
import { IPropertyBase } from 'src/app/model/ipropertybase';



@Component({
    selector:'app-property-card',
    templateUrl:'property-card.component.html',
    styleUrls:['property-card.component.css']
})
export class PropertyCardComponent{
    @Input() Property!: IPropertyBase;
    @Input() hideIcons !: Boolean;
    
}