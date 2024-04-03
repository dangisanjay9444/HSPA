import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IProperty } from '../model/iproperty';
import { Property } from '../model/property';
import {environment} from '../../environments/environment'
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { IKeyValuePair } from '../model/ikeyvaluepair';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  baseUrl = environment.baseUrl;

constructor(private http: HttpClient) { }

getAllCities():Observable<string[]>
{
   return this.http.get<string[]>(this.baseUrl +'/City/cities');
}

getProperty(id: number) {

  return this.http.get<Property>(this.baseUrl + '/property/detail/' + id.toString());
  // return this.getAllProperties(1).pipe(
  //   map(propertiesArray => {
  //     return propertiesArray.find(p => p.id === id);
  //   })
  // );
}

getPropertyTypes(): Observable<IKeyValuePair[]> {

  return this.http.get<IKeyValuePair[]>(this.baseUrl + '/propertytype/list');  
}

getFurnishingTypes(): Observable<IKeyValuePair[]> {

  return this.http.get<IKeyValuePair[]>(this.baseUrl + '/furnishingtype/list');  
}

getAllProperties(SellRent?:number): Observable<IProperty[]>
 {

  return this.http.get<IProperty[]>(this.baseUrl + '/property/list/' + SellRent?.toString());
  
 }


//getAllProperties(SellRent?:number): Observable<IProperty[]> {
  

  //return this.http.get<IProperty[]>('data/Properties.json')

  //  return this.http.get<IProperty[]>('data/Properties.json').pipe(
  //    map(data =>{

  //      const propertiesArray: Array<IProperty> = [];

  //      const itemFromLocalStorage = localStorage.getItem('newProp');
  //       if (itemFromLocalStorage !== null) {
  //         const newProperty = JSON.parse(itemFromLocalStorage);
  //         for(const id in newProperty)
  //           {
  //             if (SellRent)
  //             {
  //                 if (newProperty.hasOwnProperty(id) && newProperty[id].SellRent === SellRent)
  //               {
  //                 propertiesArray.push(newProperty[id]);
  //               }
  //             }
  //             else
  //             {
  //               propertiesArray.push(newProperty[id]);
  //             }

  //           }
  //       }

  //      for(const id in data)
  //      {
  //       if (SellRent)
  //         {
  //           if (data.hasOwnProperty(id) && data[id].sellRent === SellRent)
  //           {
  //             propertiesArray.push(data[id]);
  //           }
  //         }
  //         else
  //         {
  //           propertiesArray.push(data[id]);
  //         }
  //      }

  //      return propertiesArray;

  //    }

  //      )
  //  );
//}

addProperty(property : Property){

  const httpOptions = {
      headers:new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
  };

  return this.http.post(this.baseUrl + '/property/add', property, httpOptions);
  // let newProp = [property];

  // //add new property in array if newProp already exists in local Storage
  // const itemFromLocalStorage = localStorage.getItem('newProp');
  // if (itemFromLocalStorage !== null)
  //   {
  //     newProp = [property, ...JSON.parse(itemFromLocalStorage)];
  //   }

  // localStorage.setItem('newProp', JSON.stringify(newProp));
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

getPropertyAge(dateOfEstablishment:any):string
  {
    const today = new Date();
    const estDate = new Date(dateOfEstablishment);
    let age = today.getFullYear() - estDate.getFullYear();
    const m = today.getMonth() - estDate.getMonth();

    //current month smaller than establishment month or
    //same month and current date is smaller than the establishment date 
    if(m < 0 || (m === 0 && today.getDate() < estDate.getDate()) )
    {
      age -- ;
    }

    //estDate is a future date 
    if(today < estDate)
    {
      return '0';
    }

  // age is less than a year
    if (age === 0)
    {
      return 'less than a year'
    }
    else
    {
      return age.toString();
    }

  }

  setPropertyPhoto(propertyId:number, propertyPhotoId: string)
  {
    const httpOptions = {
      headers:new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(this.baseUrl + '/property/set-primary-photo/'+String(propertyId)
            +'/'+propertyPhotoId, {}, httpOptions);
  }

  deletePhoto(propertyId:number, propertyPhotoId: string)
  {
    const httpOptions = {
      headers:new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.delete(this.baseUrl + '/property/delete-photo/'+String(propertyId)
            +'/'+propertyPhotoId, httpOptions);
  }

}

