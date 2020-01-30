import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home/home.service';
import { Observable, of } from 'rxjs';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { tap, filter, map, shareReplay, switchMap, throwIfEmpty } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as servicesSelectors from '../state/services/services.selectors';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  endpoint$: Observable<any>;
  endpointData: any;
  specs$: Observable<any>;
  responseCodes: string[] = ["200", "401", "404", "500"];
  form: FormGroup;
  mocksVisible: boolean = false;
  filesToUpload: Array<File>;
  activeId: string;
  public selectedStatus: string;
  public options = new JsonEditorOptions;
  private editorHolder: ElementRef;
  mockId: string;
  response: any;
  searchText: any;
  headers: FormArray;
  @ViewChildren(JsonEditorComponent) editor: QueryList<JsonEditorComponent>;

  constructor(private store : Store<any>, private window: Window, private formBuilder: FormBuilder, private activeRoute: ActivatedRoute, private service: HomeService) { }

  ngOnInit() {
    this.options.mode = 'code';
    this.options.modes = ['code', 'text', 'tree', 'view'];
    this.options.statusBar = false;

    this.form = this.formBuilder.group({
      delay: 0,
      statusCode: '',
      noData: false,
      forward: false,
      headers: this.formBuilder.array([this.createHeadersInput()])
    });

    this.endpoint$ = this.store.pipe(
      select(servicesSelectors.getSelectedEndpoint),
      tap(val => {
        if (!val) {
          return;
        }
        this.mockId = val.path.substring(val.path.lastIndexOf("/") + 1);
        this.form.get("statusCode").setValue(val.statusCode);
        this.form.get("delay").setValue(val.delay);
        this.form.get("noData").setValue(val.emptyArray);
        this.response = val;
        this.endpointData = val.response[val.statusCode].data.body;
      })
    );
  }

  createHeadersInput(): FormGroup {
    return this.formBuilder.group({
      name: '',
      value: ''
    });
  }

  addHeader(): void {
    this.headers = this.form.get('headers') as FormArray;
    this.headers.push(this.createHeadersInput());
  }

  updateEndpoint() {
    let data = {
      statusCode: this.form.get('statusCode').value,
      delay: parseInt(this.form.get('delay').value, 10),
      emptyArray: this.form.get('noData').value,
      forward: this.form.get('forward').value,
      response: this.editor.first.get(),
      customHeaders: this.arrayToObject(this.form.value.headers),
    }

    this.store.pipe(
      select(servicesSelectors.getSelectedEndpoint),
      tap(selectedEndpoint => {
        this.service
          .updateEndpoint(selectedEndpoint._id, data)
          .subscribe(data => {
            this.response.response[
              this.form.get("statusCode").value
            ].data.body = this.editor.first.get();
          });
      })
    ).subscribe();

  }

  arrayToObject(array) {
    return array.reduce((obj, item) => {
      if(item.name !== '' && item.value !== ''){
        obj[item.name] = item.value
      }
      return obj
    }, {});
  }


  findMocks() {
    this.service.findMocks(this.mockId).subscribe(val => {
      this.endpointData = val[0].response;
    })
  }


  changeStatusCode(event) {
    this.endpointData = this.response.response[this.form.get('statusCode').value].data.body;
  }

  useMocks(data) {
    this.endpointData = data;
  }

  toggleMocks() {
    this.mocksVisible = !this.mocksVisible;
    console.log('this.resonse', this.response);
    this.searchText = this.response.serviceName;
    this.specs$ = this.service.getSpecs().pipe(
      shareReplay(),
    );
  }

  createSpec() {
    console.log('searchTExt', this.searchText);
    this.specs$ = this.service.createSpec({ name: this.searchText }).pipe(
      switchMap(() => this.service.getSpecs())
    )
  }

  createExamples(id) {

    this.specs$ = this.service.uploadFile(id, this.filesToUpload).pipe(
      switchMap(() => this.service.getSpecs()),
      tap(() => this.activeId = id)
    )
  }

  onFileChange(event) {
    this.filesToUpload = event.target.files;
  }

  deleteSpecs(id: string) {
    this.specs$ = this.service.deleteSpecs(id).pipe(
      switchMap(() => this.service.getSpecs())
    );
  }

  ngOnDestroy() {
    console.log('destroy');
  }
}
