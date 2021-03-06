import { Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as fileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getServices(projectName) {
    return this.http.get(`${this.url}/projects/${projectName}/services`);
  }

  getEndpoint(projectName: string, id: string) {
    return this.http.get(`${this.url}/projects/${projectName}/endpoints/${id}`);
  }

  updateEndpoint(projectName, id: string, data: any) {
    return this.http.post(`${this.url}/projects/${projectName}/endpoints/${id}`, data, {});
  }

  syncEndpoint(projectName, path) {
    return this.http.get(`${this.url}/projects/${projectName}/syncEndpoint?path=` + path);
  }

  deleteSpecs(id: string) {
    return this.http.delete(`${this.url}/specs/` + id);
  }


  createSpec(data: any) {
    return this.http.post(`${this.url}/specs`, data);
  }

  getSpecs() {
    return this.http.get(`${this.url}/specs`);
  }

  deleteService(projectName: string, serviceName: string) {
    return this.http.delete(`${this.url}/projects/${projectName}/services/${serviceName}`);
  }

  deleteEndpointById(projectName: string, id: string) {
    return this.http.delete(`${this.url}/projects/${projectName}/endpoints/${id}`);
  }


  uploadFile(id, files: Array<File>) {
    const formData: FormData = new FormData();
    for (const prop in files) {
      if (Object.prototype.hasOwnProperty.call(files, prop)) {
        formData.append('files[]', files[prop], files[prop].name);
      }
    }

    return this.http.post(`${this.url}/specs/upload/` + id, formData, {});
  }

  getPortals() {
    return this.http.get(`${this.url}/portals`);
  }

  deleteExperience(experienceName) {
    return this.http.delete(`${this.url}/portals/` + experienceName);
  }

  syncModel(data) {
    return this.http.post(`${this.url}/portals/syncmodel`, data);
  }

  updateModel(portalName, data) {
    return this.http.post(`${this.url}/portals/updatemodel/` + portalName, data);
  }

  exportProject(projectName: string, fileName: string) {
    fileSaver.saveAs(`${this.url}/projects/export/${projectName}`, `${fileName}`);
  }

  importProject(projectName: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('files[]', file, file.name);

    return this.http.post(`${this.url}/projects/import/${projectName}`, formData, {});
  }
}
