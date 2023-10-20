import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { IProperty } from '../model/iproperty';
import { Property } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

constructor(private http: HttpClient) { }

getProperty(id: number) {
  return this.getAllProperties().pipe(
    map(propertiesArray => {
      return propertiesArray.find(p => p.Id === id);
    })
  );
}

getAllProperties(SellRent?:number): Observable<IProperty[]> {

  //return this.http.get<IProperty[]>('data/Properties.json')
  
   return this.http.get<IProperty[]>('data/Properties.json').pipe(
     map(data =>{

       const propertiesArray: Array<IProperty> = [];

       const itemFromLocalStorage = localStorage.getItem('newProp');
        if (itemFromLocalStorage !== null) {
          const newProperty = JSON.parse(itemFromLocalStorage);
          for(const id in newProperty)
            {
              if (SellRent)
              {
                  if (newProperty.hasOwnProperty(id) && newProperty[id].SellRent === SellRent)
                {
                  propertiesArray.push(newProperty[id]);
                }
              }
              else
              {
                propertiesArray.push(newProperty[id]);
              }
              
            }              
        }  

       for(const id in data)
       {
        if (SellRent)
          {
            if (data.hasOwnProperty(id) && data[id].SellRent === SellRent)
            {
              propertiesArray.push(data[id]);
            }
          }
          else
          {
            propertiesArray.push(data[id]);
          }
       }

       return propertiesArray;

     }
      
       )
   );   
}

addProperty(property : Property){
  let newProp = [property];

  //add new property in array if newProp already exists in local Storage
  const itemFromLocalStorage = localStorage.getItem('newProp');
  if (itemFromLocalStorage !== null) 
    {
      newProp = [property, ...JSON.parse(itemFromLocalStorage)];
    }
  
  localStorage.setItem('newProp', JSON.stringify(newProp));
}

newPropID(){
  const itemFromLocalStorage = localStorage.getItem('PID');
  if (itemFromLocalStorage !== null) 
    {
     return (+itemFromLocalStorage) + 1;
    }
  else
  {
     localStorage.setItem('PID', '101');
     return 101;
  }
}

}
