import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { countries } from './countries';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PhoneFieldComponent implements OnInit, AfterViewInit {
  @Input() label: string = 'Phone Number';
  @Input() placeholder: string = 'Enter phone number';

  @ViewChild('inputContainer') inputContainer!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  countries = countries;
  defaultCountry: any;
  selectedCountry: any;
  phoneNumber: string = '';
  displayPhoneNumber: string = '';
  dropdownOpen = false;
  inputContainerWidth: number = 0;
  phoneError: string = '';
  temporaryCheck: boolean = true;
  isDisabled: boolean = false;

  ngOnInit() {
    // Set default country based on user's timezone
    this.defaultCountry =
      this.countries.find(
        (country) => country.code === this.getUserCountryCode()
      ) || this.countries[0];
    this.selectedCountry = this.defaultCountry;
    this.phoneNumber = this.defaultCountry.code;
    this.displayPhoneNumber = this.formatPhoneNumber(this.defaultCountry.code);
  }

  ngAfterViewInit() {
    if (this.inputContainer) {
      this.inputContainerWidth = this.inputContainer.nativeElement.offsetWidth;
    }
  }

  toggleDropdown() {
    // Close dropdown if it's already open
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectCountry(country: any) {
    // Update phone number with new country code
    const previousCountryCode = this.selectedCountry.code;
    this.selectedCountry = country;
    this.phoneNumber =
      country.code + this.phoneNumber.slice(previousCountryCode.length);
    this.displayPhoneNumber = this.formatPhoneNumber(this.phoneNumber);
    this.dropdownOpen = false;
  }

  onPhoneInputChange(event: any) {
    // Update phone number and display phone number
    this.phoneNumber = this.stripFormatting(event);
    this.displayPhoneNumber = this.formatPhoneNumber(this.phoneNumber);
    this.validatePhoneNumber();
  }

  onPhoneInputBlur() {
    // Validate phone number on blur
    this.validatePhoneNumber();
    this.temporaryCheck = true;
  }

  validatePhoneNumber() {
    // Using a simple regex to validate phone number
    const phoneRegex = /^[+][0-9]{1,3}[0-9]{7,14}$/;
    if (!phoneRegex.test(this.phoneNumber)) {
      this.phoneError = 'Please enter a valid phone number.';
      this.temporaryCheck = false;
    } else {
      this.phoneError = '';
      this.temporaryCheck = true;
    }
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Format phone number as +XX XXX XXX XXXX
    const countryCodeLength = this.selectedCountry.code.length;
    const countryCode = phoneNumber.slice(0, countryCodeLength);
    const areaCode = phoneNumber.slice(
      countryCodeLength,
      countryCodeLength + 3
    );
    const subscriberNumber_1 = phoneNumber.slice(
      countryCodeLength + 3,
      countryCodeLength + 6
    );
    const subscriberNumber_2 = phoneNumber.slice(countryCodeLength + 6);
    return `${countryCode} ${areaCode} ${subscriberNumber_1} ${subscriberNumber_2}`.trim();
  }

  stripFormatting(phoneNumber: string): string {
    // Remove spaces from phone number
    return phoneNumber.replace(/\s+/g, '');
  }

  togglePhoneInputDisable() {
    // Toggle phone input disable/enable state
    this.isDisabled = !this.isDisabled;
    this.phoneNumber = this.selectedCountry.code; // Reset phone number
    this.displayPhoneNumber = this.formatPhoneNumber(this.selectedCountry.code); // Reset display phone number
    this.phoneError = ''; // Clear error message
  }

  private getUserCountryCode(): string {
    // Map user timezones to country codes for demo purposes only
    const timezones: { [key: string]: string } = {
      'America/New_York': '+1',
      'Asia/Tokyo': '+81',
      'Asia/Ho_Chi_Minh': '+84',
      'Asia/Shanghai': '+86',
      'Australia/Sydney': '+61',
      'Europe/Berlin': '+49',
      'Europe/London': '+44',
      'Europe/Paris': '+33',
      'Europe/Rome': '+39',
    };
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryCode = timezones[userTimezone] || 'Unknown';
    if (countryCode === 'Unknown') {
      console.error(
        'Country code not found for the user timezone. Defaulting to Germany.'
      );
      return '+49';
    }
    return countryCode;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close dropdown when clicking outside of the dropdown menu
    if (
      this.dropdownOpen &&
      this.dropdownMenu &&
      !this.dropdownMenu.nativeElement.contains(event.target) &&
      !this.inputContainer.nativeElement.contains(event.target)
    ) {
      this.dropdownOpen = false;
    }
  }
}
