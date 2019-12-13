import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';

import { FlexLayoutModule } from '@angular/flex-layout';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { MocksComponent } from './mocks/mocks.component';
import { ServiceComponent } from './service/service.component';
import { ModelComponent } from './model/model.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailsComponent,
    MocksComponent,
    ServiceComponent,
    ModelComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    MatListModule,
    MatExpansionModule,
    NgJsonEditorModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: Window, useValue: window}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
