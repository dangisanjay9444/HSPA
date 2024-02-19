import { animateChild } from '@angular/animations';
import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
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
  propertyType: Array<String> = ['Appartment','Villa','Duplex'];
  furnishType: Array<String> = ['Fully','Semi','Unfurnished'];
  mainEnterance: Array<String> = ['East','West','North','South'];
  cityList!: any[];//string[];

  propertyView: IPropertyBase = {
    Id: null,
    SellRent: null,
    BHK: null,
    PType: null,
    FType: null,
    Name: '',
    City: '',
    Price: null,
    BuildArea: null,
    RTM: null
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private housingService: HousingService,
              private alertify : AlertyfyService) { }

  ngOnInit() {
    this.CreateAddPropertyForm();
    this.housingService.getAllCities().subscribe(data =>
        {
          console.log(data);
          this.cityList = data;
        }
      );

  }

  mapProperty(): void {
    this.property.Id = this.housingService.newPropID();
    this.property.SellRent = +this.SellRent.value;
    this.property.BHK = this.BHK.value;
    this.property.PType = this.PType.value;
    this.property.Name = this.Name.value;
    this.property.City = this.City.value;
    this.property.FType = this.FType.value;
    this.property.Price = this.Price.value;
    this.property.Security = this.Security.value;
    this.property.Maintenance = this.Maintenance.value;
    this.property.BuildArea = this.BuildArea.value;
    this.property.CarpetArea = this.CarpetArea.value;
    this.property.FloorNo = this.FloorNo.value;
    this.property.TotalFloor = this.TotalFloor.value;
    this.property.Address = this.Address.value;
    this.property.Address2 = this.Landmark.value;
    this.property.RTM = this.RTM.value;
    this.property.AOP = this.AOP.value;
    this.property.Gated = this.Gated.value;
    this.property.MainEntrance = this.MainEnterance.value;
    this.property.PossessionOn = this.PossessionOn.value;
    this.property.Description = this.Description.value;
    this.property.PostedOn = new Date().toString();
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
        Security : [null],
        Maintenance : [null]
      }),

      AddressInfo : this.fb.group({
        FloorNo : [null],
        TotalFloor : [null],
        Address : [null, Validators.required],
        Landmark : [null]
      }),

      OtherInfo : this.fb.group({
        RTM : [null, Validators.required],
        PossessionOn : [null],
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
      this.housingService.addProperty(this.property);
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
