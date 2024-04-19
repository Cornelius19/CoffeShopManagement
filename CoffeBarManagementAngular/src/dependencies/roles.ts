import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export  class Roles{
    static readonly Admin = 'Admin';
    static readonly Client = 'Client';
    static readonly Employee = 'Employee';
    readonly Admin1 = 'Admin';
    readonly Client1 = 'Client';
    readonly Employee1 = 'Employee';
}