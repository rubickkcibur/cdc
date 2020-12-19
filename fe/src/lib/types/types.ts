import { Contacts } from "../../components/Routes";
import { Tip } from "../search";
import {Moment} from 'moment'

export interface BaseItem {
    _id: null;
    basic: Basic;
    path: Path;
}

export interface Basic {
    name: string;
    personal_id: string;
    gender: string;
    phone: string;
    age: string;
    addr1: string[];
    addr2: string;
}

export interface Path {
    nodes: Node[];
    edges: Array<Edge | null>;
}

export interface Edge {
    traffic: string;
}

export interface Node {
    time: string;
    location: Location;
    contacts?: string[];
    contact_ids?: string[];
    details?: string;
}

export interface Location {
    id: string;
    name: string;
    district: string;
    adcode: string;
    location: string;
    address: string;
    typecode: string;
    city: any[];
}

export interface PForm{
    time:string|null|undefined, //time是什么类型
    location:Tip|null|undefined,
    contacts:Contacts[]
}
  
export interface TForm{
    transform:string|undefined,
    note:string|undefined
}
  
export interface NForm {
    pause?:PForm,
    travel?:TForm
}
  
export interface RForm{
    date:string,
    route:NForm[]
}
  
export interface Routes{
    routes:RForm[]
}

export interface PersonDocument{
    _id:null,
    basic:Basic,
    routes:RForm[]
}


