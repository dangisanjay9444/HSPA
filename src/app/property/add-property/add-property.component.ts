import { animateChild } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IKeyValuePair } from 'src/app/model/ikeyvaluepair';
import { IPropertyBase } from 'src/app/model/ipropertybase';
import { Property } from 'src/app/model/property';
import { AlertyfyService } from 'src/app/services/alertyfy.service';
import { HousingService } from 'src/app/services/housing.service';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements OnInit {
  // @ViewChild('Form') addPropertyForm!: NgForm;
  @ViewChild('formTabs') formTabs!: TabsetComponent;
  addPropertyForm!: FormGroup;
  nextClicked!: boolean;
  property = new Property();

//later will fetch these information from the master tables
  // propertyType: Array<String> = ['Appartment','Villa','Duplex'];
  // furnishType: Array<String> = ['Fully','Semi','Unfurnished'];

 //fetch these information from the master tables 
  propertyType!: IKeyValuePair[];
  furnishType!: IKeyValuePair[];
  
  mainEnterance: Array<String> = ['East','West','North','South'];
  cityList!: any[];//string[];

  propertyView: IPropertyBase = {
    id: null,
    sellRent: null,
    bhk: null,
    propertyType: null,
    furnishingType: null,
    name: '',
    city: '',
    price: null,
    buildArea: null,
    readyToMove: null
  };

  constructor(private fb: FormBuilder,
              private datepipe: DatePipe,
              private router: Router,
              private housingService: HousingService,
              private alertify : AlertyfyService) { }

  ngOnInit() {

    if(!localStorage.getItem('userName'))
    {
      this.alertify.error('You must be logged in to add new property !');
      this.router.navigate(['/user/login']);
    }

    this.CreateAddPropertyForm();
    this.housingService.getAllCities().subscribe(data =>
        {
          console.log(data);
          this.cityList = data;
        }
      );

    this.housingService.getPropertyTypes().subscribe(data =>{
          this.propertyType = data;
        }
    );

    this.housingService.getFurnishingTypes().subscribe(data =>{
      this.furnishType = data;
    }
);

  }

  handlePriceChange(event: any) {
    // Parse the input value to an integer and assign to propertyView.price
    this.propertyView.price = parseInt(event.target.value);
  }

  handleBuildAreaChange(event: any) {
    // Parse the input value to an integer and assign to propertyView.price
    this.propertyView.buildArea = parseInt(event.target.value);
  }

  // updateEstPossessionOn(value: string) {
  //   // Parse the string value to a Date object
  //   this.propertyView.estPossessionOn = new Date(value);
  // }

  mapProperty(): void {
    this.property.id = this.housingService.newPropID();
    this.property.sellRent = +this.SellRent.value;
    this.property.bhk = this.BHK.value;
    this.property.propertyTypeId = this.PType.value;
    this.property.name = this.Name.value;
    this.property.cityId = this.City.value;
    this.property.furnishingTypeId = this.FType.value;
    this.property.price = this.Price.value;
    this.property.security = this.Security.value;
    this.property.maintenance = this.Maintenance.value;
    this.property.buildArea = this.BuildArea.value;
    this.property.carpertArea = this.CarpetArea.value;
    this.property.floorNo = this.FloorNo.value;
    this.property.totalFloor = this.TotalFloor.value;
    this.property.address = this.Address.value;
    this.property.address2 = this.Landmark.value;
    this.property.readyToMove = this.RTM.value;
    // this.property.age = this.AOP.value;
    this.property.gated = this.Gated.value;
    this.property.mainEntrance = this.MainEnterance.value;
    this.property.estPossessionOn = this.datepipe.transform(this.PossessionOn.value, 'MM/dd/yyyy');
    this.property.description = this.Description.value;
    // this.property.PostedOn = new Date().toString();
  }

  CreateAddPropertyForm(){
    this.addPropertyForm = this.fb.group({
      BasicInfo: this.fb.group({
        SellRent: [1, Validators.required],
        BHK : [null, Validators.required],
        PType : [null, Validators.required],
        FType : [null, Validators.required],
        Name : [null, Validators.required],
        City : [null, Validators.required]
      }),

      PriceInfo : this.fb.group({
        Price : [null, Validators.required],
        BuildArea : [null, Validators.required],
        CarpetArea : [null],
        Security : [0],
        Maintenance : [0]
      }),

      AddressInfo : this.fb.group({
        FloorNo : [null],
        TotalFloor : [null],
        Address : [null, Validators.required],
        Landmark : [null]
      }),

      OtherInfo : this.fb.group({
        RTM : [null, Validators.required],
        PossessionOn : [null, Validators.required],
        AOP : [null],
        Gated : [null],
        MainEnterance : [null],
        Description : [null]
      })
    });
  }

  onBack()
  {
    this.router.navigate(['/']);
  }

  onSubmit() //Form: NgForm
  {
    this.nextClicked = true
    if (this.allTabsValid())
    {
      this.mapProperty();
      this.housingService.addProperty(this.property).subscribe(
        () => {
          this.alertify.success('Conrats, Property added Successfully')
          //console.log(Form);
          console.log("SellRent=" + this.addPropertyForm.value.SellRent)
          console.log(this.addPropertyForm);
    
          if (this.SellRent.value == 2)
          {
            this.router.navigate(['/rent-property'])
          }
          else
          {
            this.router.navigate(['/'])
          }
        }
      );
      
    }
    else
    {
      this.alertify.error('Please enter all the required fields to add the property')
    }
  }

  allTabsValid(){
    if (this.BasicInfo.invalid)
    {
      this.formTabs.tabs[0].active = true;
      return false;
    }
    if (this.PriceInfo.invalid)
    {
      this.formTabs.tabs[1].active = true;
      return false;
    }
    if (this.AddressInfo.invalid)
    {
      this.formTabs.tabs[2].active = true;
      return false;
    }
    if (this.OtherInfo.invalid)
    {
      this.formTabs.tabs[3].active = true;
      return false;
    }
    return true;
  }

  selectTab(tabId: number, IsCurrentTabValid : Boolean) {
    this.nextClicked = true;
    if(IsCurrentTabValid )
    {
      this.formTabs.tabs[tabId].active = true;
    }

  }

  // #region <getter methods>
      // #region <FormGroups>
            get BasicInfo(){
              return this.addPropertyForm.controls['BasicInfo'] as FormGroup;
            }
            get PriceInfo(){
              return this.addPropertyForm.controls['PriceInfo'] as FormGroup;
            }
            get AddressInfo(){
              return this.addPropertyForm.controls['AddressInfo'] as FormGroup;
            }
            get OtherInfo(){
              return this.addPropertyForm.controls['OtherInfo'] as FormGroup;
            }
      // #endregion
      // #region <FormControls>
            // Basic Info Controls
            get SellRent(){
              return this.BasicInfo.controls['SellRent'] as FormControl;
            }
            get BHK(){
              return this.BasicInfo.controls['BHK'] as FormControl;
            }
            get PType(){
              return this.BasicInfo.controls['PType'] as FormControl;
            }
            get FType(){
              return this.BasicInfo.controls['FType'] as FormControl;
            }
            get Name(){
              return this.BasicInfo.controls['Name'] as FormControl;
            }
            get City(){
              return this.BasicInfo.controls['City'] as FormControl;
            }
            // Price Info Controls
            get Price(){
              return this.PriceInfo.controls['Price'] as FormControl;
            }
            get BuildArea(){
              return this.PriceInfo.controls['BuildArea'] as FormControl;
            }
            get CarpetArea(){
              return this.PriceInfo.controls['CarpetArea'] as FormControl;
            }
            get Security(){
              return this.PriceInfo.controls['Security'] as FormControl;
            }
            get Maintenance(){
              return this.PriceInfo.controls['Maintenance'] as FormControl;
            }
            // AddressInfo Controls
            get FloorNo(){
              return this.AddressInfo.controls['FloorNo'] as FormControl;
            }
            get TotalFloor(){
              return this.AddressInfo.controls['TotalFloor'] as FormControl;
            }
            get Address(){
              return this.AddressInfo.controls['Address'] as FormControl;
            }
            get Landmark(){
              return this.AddressInfo.controls['Landmark'] as FormControl;
            }

            // OtherInfo Controls
            get RTM(){
              return this.OtherInfo.controls['RTM'] as FormControl;
            }
            get PossessionOn(){
              return this.OtherInfo.controls['PossessionOn'] as FormControl;
            }
            get AOP(){
              return this.OtherInfo.controls['AOP'] as FormControl;
            }
            get Gated(){
              return this.OtherInfo.controls['Gated'] as FormControl;
            }
            get MainEnterance(){
              return this.OtherInfo.controls['MainEnterance'] as FormControl;
            }
            get Description(){
              return this.OtherInfo.controls['Description'] as FormControl;
            }

      // #endregion
   // #endregion
}
