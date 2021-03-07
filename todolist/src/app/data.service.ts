import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:3333";
  private REST_API_TODO = "https://cat-fact.herokuapp.com/facts/random?animal_type=dog&amount=3";

  constructor(private httpClient: HttpClient) { }

  public getToDoListRequest() {
    return this.httpClient.get(`${this.REST_API_SERVER}/todos`);
  }

  public getNewToDoListRequest() {
    return this.httpClient.get(`${this.REST_API_TODO}`);
  }

  public gravarNewTarefa(data) {
    return this.httpClient.post(`${this.REST_API_SERVER}/todos`, data);
  }
}
