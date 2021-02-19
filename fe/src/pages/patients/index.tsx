import { Button, Card, Descriptions, Select, Table, Timeline } from "antd";
import DescriptionsItem from "antd/lib/descriptions/Item";
import React, { useDebugValue, useEffect, useState } from "react";
import DebouncedAutocomplete from "../../components/AutoComplete";
import MainLayout from "../../components/MainLayoout/PageLayout"
import { useTypedSelector } from "../../lib/store";
import sty from './index.module.scss'
import { BaseItem, Node, Basic } from '../../lib/types/types'
import { ColumnsType } from "antd/lib/table";
import { extracDate } from "../../lib/utils";
import { useDispatch } from "react-redux";
import { ActSetState } from "../../lib/state/global";
import Axios from "axios";
import Constant from '../../lib/constant'
import Search from "antd/lib/input/Search";
import { useRouter } from "next/dist/client/router";
//import Search from "../../lib/search";


export default function Pagepatients() {

    const dispatch = useDispatch()
    const router = useRouter()
    const [patients, setP] = useState<Basic[]>();
    const [patientBuffer, setPB] = useState<Basic[]>();

    function showOnMap(e:any){
      Axios.get(`${Constant.apihost}/queryperson`,{
        params:{
          personal_id:e.personal_id
        }
      })
      .then(e=>{
        dispatch(ActSetState({
          loadedBasic:e.data.basic,
          loadedRoutes:e.data.routes,
          showedRoutes:Array(e.data.routes.length).fill(0)
        }))
      })
      .then(e=>{
        router.push("..")
      })
    }

    const patientColumns:ColumnsType<Basic> = [
      {
        title: "姓名",
        dataIndex: "name",
        width:150
      },
      {
        title: "身份证号",
        dataIndex: "personal_id",
        width:150
      },
      {
        title: "性别",
        dataIndex: "gender",
        width:150,
        filters:[
          {
            text:"男",
            value:"male"
          },
          {
            text:"女",
            value: "female"
          }
        ],
        onFilter:(value,record)=>{return record.gender == value;},
        render:text=>(text=="male"?"男":"女")
      },
      {
        title: "电话",
        dataIndex: "phone",
        width:150
      },
      {
        title: "年龄",
        dataIndex: "age",
        width:150,
        sorter:(a,b)=>(Number(a.age)-Number(b.age))
      },
      {
        title: "所在地",
        dataIndex: "addr1",
        width:150
      },
      {
        title: "详细地址",
        dataIndex: "addr2",
        width:150
      },
      {
        title: "操作",
        render: (e) => (<a onClick={()=>{showOnMap(e)}}>在地图上显示</a>),
        width:150
      }
    ]
    // const dispatch = useDispatch();
    // const loaded_form = useTypedSelector(e => e.PAGlobalReducer.loaded_form);
    // const all_form = useTypedSelector(e=>e.PAGlobalReducer.personalSearchedResults);
    //console.log(loaded_form?.basic.personal_id);
    
    const onSearch = (value:string) => {
      if (value == ""){
        setP(patientBuffer)
      }else{
        setP(patientBuffer?.slice().filter(e=>e.name==value))
      }
    }

    const getBasics = () => {
      Axios.get(`${Constant.apihost}/getall`)
      .then(e=>{
        setP(e.data)
        setPB(e.data)
      })
    } 

    useEffect(()=>{
      if(!patients){
        getBasics()
      }
    })
    
    return(
      <MainLayout>
        <div className={sty.Table}>
        <Search placeholder="输入患者姓名" onSearch={onSearch}/>
        <Table<Basic>
          columns={patientColumns} 
          dataSource={patients} 
          //scroll={{ y: 240 }}
          pagination={{
            pageSizeOptions:["10","10","30"],
            defaultPageSize:10,
            showSizeChanger:true
          }}/>
        </div>
      </MainLayout>
    )
    
  //   const renderPauseTable:(pau:Node[]) => JSX.Element = (pau)=>{
  //     var data:tableData[] = []
  //     for(let i = 0;i < pau.length;i++){
  //       try {
  //         data.push({
  //           key:i,
  //           name:pau[i].location.name,
  //           time:pau[i].time,
  //           location:pau[i].location.location,
  //           district:pau[i].location.district,
  //           address:pau[i].location.address
  //         })
  //       }catch(e){
  //         console.log(i)
  //         console.log(pau)
  //         console.log(pau[i])
  //       }
  //     }
  //     return (
  //       <Table<tableData> columns={columns} dataSource={data} scroll={{ y: 240 }}/>
  //     )
  //   }

  //   const renderAllDates:(items:BaseItem[]) => JSX.Element = (items)=>{
  //     const compareDate:(a:BaseItem,b:BaseItem) => number = (a,b)=>{
  //       var d1:string[] = extracDate(a.path.nodes[0].time)[0].split('-')
  //       var d2:string[] = extracDate(b.path.nodes[0].time)[0].split('-')
  //       if (Number(d1[0]) - Number(d2[0])){
  //         return Number(d1[0]) - Number(d2[0])
  //       }
  //       if (Number(d1[1]) - Number(d2[1])){
  //         return Number(d1[1]) - Number(d2[1])
  //       }
  //       return Number(d1[2]) - Number(d2[2])
  //     }

  //     var sorted:BaseItem[] = items.slice().sort(compareDate)
  //     console.log(sorted)
  //     return(
  //       <Timeline mode='left'>
  //         {
  //           sorted.map((e,idx)=>(
  //           <Timeline.Item>
  //             <div>
  //               <h3>{extracDate(e.path.nodes[0].time)[0]}</h3>
  //               <Button onClick={()=>(dispatch(ActSetState({loaded_form:sorted[idx]})))}>在地图上显示</Button>
  //             </div>
  //             {renderPauseTable(e.path.nodes)}
  //           </Timeline.Item>
  //           ))
  //         }
  //       </Timeline>
  //     )
  //   }

  //   return <MainLayout>
  //   <div>
  //     <Descriptions title="患者信息" bordered>
  //       <Descriptions.Item label="姓名">
  //         {loaded_form?.basic.name}
  //       </Descriptions.Item>
  //       <Descriptions.Item label="性别">
  //         {loaded_form?.basic.gender}
  //       </Descriptions.Item>
  //       <Descriptions.Item label="年龄">
  //         {loaded_form?.basic.age}
  //       </Descriptions.Item>
  //       <Descriptions.Item label="身份证号" span={1.5}>
  //         {loaded_form?.basic.personal_id}
  //       </Descriptions.Item>
  //       <Descriptions.Item label="手机号码" span={1.5}>
  //         {loaded_form?.basic.phone}
  //       </Descriptions.Item>
  //       <Descriptions.Item label="地址" span={3}>
  //         {loaded_form?.basic.addr1[0]}&nbsp; 
  //         {loaded_form?.basic.addr1[0]}&nbsp;
  //         {loaded_form?.basic.addr1[0]}&nbsp;
  //         {loaded_form?.basic.addr2}
  //       </Descriptions.Item>
  //     </Descriptions>
  //   </div>
  //   <div>
  //     {
  //       all_form ? renderAllDates(all_form) :null
  //     }
  //   </div>
  // </MainLayout>
    
}