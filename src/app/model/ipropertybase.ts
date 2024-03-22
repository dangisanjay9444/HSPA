export interface IPropertyBase{
    id: number | null;
    sellRent : number | null,
    name: string | null;
    propertyType: string | null;
    furnishingType: string | null;    
    price: number | null;
    bhk : number | null;
    buildArea: number | null;
    city: string | null;
    readyToMove : boolean | null;
    estPossessionOn?: string | null;
    photo ?: string;
}