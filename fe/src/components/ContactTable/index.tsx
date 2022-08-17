import { Row, Table } from "antd";
import { useTypedSelector } from "../../lib/store";

export default function ContactTable({dataSource}) {
    const all_patients = useTypedSelector(e=>e.PAGlobalReducer.all_patients)
    const contact_types = ['同居','同事','同学','同车','共餐','同行','短暂接触','开会']
    const columns = [
        {
            title: '姓名1',
            dataIndex: 'name1',
            key: 'name1',
            width: "20%",
            filters:all_patients.map((p:any)=>({
                text:p.name,
                value:p.pid
            })),
            onFilter:(value,record)=>{return record.pid1 == value || record.pid2 == value;}
        },
        {
            title: '姓名2',
            dataIndex: 'name2',
            key: 'name2',
            width: "20%"
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width:"20%",
            filters:[
                {
                    text:"密接",
                    value:"密接"
                },
                {
                    text:"次密接",
                    value:"次密接"
                }
            ],
            onFilter:(value,record)=>{return record.type == value;}
        },
        {
            title: '详细',
            dataIndex: 'note',
            key: 'note',
            width:"40%",
            filters:contact_types.map((e)=>({
                text:e,
                value:e
            })),
            onFilter:(value,record)=>{
                return record.note == value 
                || record.note.split("-")[0] ==value 
                || record.note.split("-")[2] ==value;
            }
        },
      ];
    return(
        <Row>
            <Table dataSource={dataSource} columns={columns} style={{"width":"90%"}}/>
        </Row>
    )
}