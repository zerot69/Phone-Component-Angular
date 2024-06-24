import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PhoneFieldComponent } from './phone-field/phone-field.component';
import { FormsModule } from '@angular/forms';

interface Country {
  name: string;
  code: string;
  dialCode: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PhoneFieldComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Phone Input';
}
