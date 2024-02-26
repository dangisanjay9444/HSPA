import { Component } from '@angular/core';
import { HousingService } from 'src/app/services/housing.service'
import { ActivatedRoute } from '@angular/router';
import { IProperty } from 'src/app/model/iproperty';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent {

  SellRent = 1

  Properties: Array<IProperty> = [];

  Today = new Date();

  City = '';
  SearchCity = '';
  SortByParam = '';
  SortDirection = 'asc';

  constructor(private route: ActivatedRoute,private housingService: HousingService){}

  ngOnInit() : void{

    if (this.route.snapshot.url.toString())
    {
      this.SellRent = 2; // means we are on rent url else we are on base url
    }

    this.housingService.getAllProperties(this.SellRent).subscribe(
      data=>{
        this.Properties = data;
        // const itemFromLocalStorage = localStorage.getItem('newProp');
        // if (itemFromLocalStorage !== null) {
        //   const newProperty = JSON.parse(itemFromLocalStorage);

        //   if (newProperty.SellRent === this.SellRent)
        //   {
        //     this.Properties = [newProperty, ...this.Properties];
        //   }
        // }
        console.log(data);
      }
    )
  }


  onCityFilter(){
    this.SearchCity = this.City;
  }

  onCityFilterClear(){
    this.City = '';
    this.SearchCity = '';
  }

  onSortDirection(){
    if(this.SortDirection === 'desc')
    {
      this.SortDirection = 'asc';
    }
    else{
      this.SortDirection = 'desc';
    }
  }
}
