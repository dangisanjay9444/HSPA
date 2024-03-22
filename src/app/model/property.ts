import { IPropertyBase } from "./ipropertybase";
import { Photo } from "./photo";

export class Property implements IPropertyBase{
  id!: number;
  sellRent!: number;
  name!: string;
  propertyTypeId !:number;
  propertyType!: string;
  bhk!: number;
  furnishingTypeId!: number;
  furnishingType!: string;
  price!: number;
  buildArea!: number;
  carpertArea?: number;
  address!: string;
  address2?: string;
  cityId!:number;
  city!: string;
  floorNo?: string;
  totalFloor?: string;
  readyToMove!: boolean;
  age?: string;
  mainEntrance?: string;
  security?: number;
  gated?: number;
  maintenance?: number;
  estPossessionOn?: string | null;
  image?: string;
  description?: string;
  photos?:Photo[]
  //PostedOn!: string;
  //PostedBy!: number;    
}