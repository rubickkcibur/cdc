import { Contacts } from "../../components/Routes";
import { Tip } from "../search";
import {Moment} from 'moment'

export interface BaseItem {
    _id: null;
    basic: Basic;
    path: Path;
}

export interface Overseas {
    traveled_country: string[];
    passing_country: string[];
    nation: string;
    passport_id: string;
    arrival_port: string[];
    arrival_date: string;
    arrival_transport: string[];
}
export interface Basic {
    name: string; //姓名
    personal_id: string; //身份证号
    gender: string; //性别
    phone: string; //电话号码
    age: string; //年龄
    addr1: string[]; //居住地（行政区）
    addr2: string; //居住地（详细）
    vocation: string; //职业
    working_place: string; //工作地点
    confirmed_time: string; //确诊时间
    height: string; //身高
    weight: string; //体重
    overseas: Overseas | null; //境外输入信息
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
    stay:string[],
    location:Tip|null|undefined,
    detail_location?:string,
    protection:string,
    contacts:Contacts[]
}
  
export interface TForm{
    transform:string|undefined,
    note:string|undefined,
    protection:string,
    contacts:Contacts[]
}
  
export interface NForm {
    pause?:PForm,
    travel?:TForm
}
  
export interface RForm{
    date:string,
    route:NForm[],
    remarks?:string
}
  
export interface Routes{
    routes:RForm[]
}

export interface PersonDocument{
    _id?:null|undefined,
    basic:Basic,
    routes:RForm[]
}

export interface Epidemic{
    name:string,
    patients:Number,
    first_time:string,
    gene?:string,
    temprature:Number[],
    humidity:Number[]
}


