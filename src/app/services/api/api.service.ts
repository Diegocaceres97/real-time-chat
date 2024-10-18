import { inject, Injectable } from '@angular/core';
import { Database, equalTo, get, orderByChild, push, ref, set } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private db = inject(Database);

  constructor() { }

  getRef(path: string) {
    return ref(this.db, path);
  }

  setData<T>(path: string, data: T) {
    return set(this.getRef(path), data);
  }

  setRefData<T>(ref: any, data: T) {
    return set(ref, data);
  }

  getData(query: any) {
    return get(query);
}

orderByChild(path: string) {
  return orderByChild(path);
}

equalTo(value: any){
  return equalTo(value);
}

pushData(ref:any){
  return push(ref);
}
}
