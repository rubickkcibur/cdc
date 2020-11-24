
export interface BaseItem {
    _id: null;
    basic: Basic;
    path: Path;
}

export interface Basic {
    name: string;
    person_id: string;
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




