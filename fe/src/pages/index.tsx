import { Button, Card, Col, Descriptions, Dropdown, Popover, Row, Select, Table, Timeline } from "antd";
import DescriptionsItem from "antd/lib/descriptions/Item";
import React, { useDebugValue, useEffect, useState } from "react";
import DebouncedAutocomplete from "../components/AutoComplete";
import MainLayout from "../components/MainLayoout/PageLayout"
import { useTypedSelector } from "../lib/store";
import sty from './index.module.scss'
import { BaseItem, Node, Basic } from '../lib/types/types'
import { ColumnsType } from "antd/lib/table";
import { extracDate } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { ActSetState } from "../lib/state/global";
import Axios from "axios";
import Constant from '../lib/constant'
import Search from "antd/lib/input/Search";
import { useRouter } from "next/dist/client/router";
import { DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import EpidChoose from "../components/EpidChoose";
import PopOver from "../components/PopOver";
//import Search from "../../lib/search";

const Big = ({str}:{str:string})=><span style={{fontSize:"18px"}}>{str}</span>


export default function Pagepatients() {

    const dispatch = useDispatch()
    const router = useRouter()
    const [chosenKey,setCK] = useState<any>()
    const [patients, setP] = useState<any[]>();
    const [patientBuffer, setPB] = useState<any[]>();
    const epidemics=useTypedSelector(e => e.PAGlobalReducer.epidemics);

    useEffect(()=>{
      if(!epidemics){
        console.log("void")
        Axios.get(`${Constant.apihost}/getAllEpidemics`)
        .then(e=>{
          dispatch(ActSetState({epidemics:e.data as any}))
        })
      }
    })

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
          loadedEpiKey:chosenKey,
          showedRoutes:Array(e.data.routes.length).fill(0)
        }))
      })
      .then(e=>{
        router.push("./addroute")
      })
    }

    function analyze(e:any){
      Axios.post(`${Constant.apihost}/queryRelatedInfo`,{
        personal_id:e.personal_id,
        hour:8,
        distance:5
      }).then(e=>{
        dispatch(ActSetState({loadedRelatedInfo:e.data}))
      }).catch(e=>console.log(e))

      Axios.get(`${Constant.apihost}/queryperson`,{
        params:{
          personal_id:e.personal_id
        }
      })
      .then(e=>{
        dispatch(ActSetState({
          loadedBasic:e.data.basic,
          loadedRoutes:e.data.routes,
          loadedEpiKey:chosenKey,
          showedRoutes:Array(e.data.routes.length).fill(0)
        }))
      })
      .then(e=>{
        router.push("./patientAnalyze")
      })
    }

    const patientColumns:ColumnsType<Basic> = [
      {
        title: <Big str="姓名"/>,
        dataIndex: "name",
        width:150,
        render: (txt)=> <span style={{fontSize:"18px"}}>{txt}</span>
      },
      {
        title: <Big str="身份证号"/>,
        dataIndex: "personal_id",
        width:150,
        render: (txt)=> <span style={{fontSize:"18px"}}>{txt}</span>
      },
      {
        title: <Big str="性别"/>,
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
        render:text=>(<span style={{fontSize:"18px"}}>{text=="male"?"男":"女"}</span>)
      },
      {
        title: <Big str="电话"/>,
        dataIndex: "phone",
        width:150,
        render: (txt)=> <span style={{fontSize:"18px"}}>{txt}</span>
      },
      {
        title: <Big str="年龄"/>,
        dataIndex: "age",
        width:150,
        render: (txt)=> <span style={{fontSize:"18px"}}>{txt}</span>,
        sorter:(a,b)=>(Number(a.age)-Number(b.age))
      },
      {
        title: <Big str="所在地"/>,
        dataIndex: "addr1",
        width:150,
        render: (txt)=> <span style={{fontSize:"18px"}}>{txt}</span>
      },
      {
        title: <Big str="详细地址"/>,
        dataIndex: "addr2",
        width:150,
        render: (txt)=> <span style={{fontSize:"18px"}}>{txt}</span>
      },
      {
        title: <Big str="完成度"/>,
        // render: (e) =>(
        //   <div style={{color:"red"}}>{
        //     e.name!="李某某"?"14/14":
        //     <div>{"4/14"}
        //       <Popover 
        //         placement="rightBottom"
        //         content={<>
        //           <h5>1、工作地点未填写</h5>
        //           <br/>
        //           <h5>2、职业未填写</h5>
        //         </>}
        //         title={<h4 style={{color:"red"}}>以下内容未完成</h4>}
        //         trigger="click">
        //           &nbsp;&nbsp;<QuestionCircleOutlined />
        //       </Popover>
        //     </div>
        //   }</div>
        // ),
        render:(e)=>(
          <div style={{color:"red"}}>{
            e.done>=14?"14/14":
            <div>
              <span style={{fontSize:"18px"}}>{String(e.done) + "/14"}</span>
              <Popover 
                placement="rightBottom"
                content={<>
                  <h5>1、工作地点未填写</h5>
                  <br/>
                  <h5>2、职业未填写</h5>
                </>}
                title={<h4 style={{color:"red"}}>以下内容未完成</h4>}
                trigger="click">
                  &nbsp;&nbsp;<QuestionCircleOutlined />
              </Popover>
            </div>}
          </div>
            ),
        width:100
      },
      {
        title: <Big str="操作"/>,
        render: (e) => (
          <div style={{
            display:"flex",
            flexDirection:"row",
            justifyContent:"space-between"
          }}>
            <span style={{fontSize:"18px"}}><a onClick={()=>{showOnMap(e)}}>流调管理</a></span>
            {/* &nbsp;&nbsp; */}
            <PopOver str="报告管理"/>
            <span style={{fontSize:"18px"}}><a onClick={()=>{analyze(e)}}>案例分析</a></span>
            {/* &nbsp;&nbsp; */}
          </div>
        ),
        width:225
      }
    ]
    
    const onSearch = (value:string) => {
      if (value == ""){
        setP(patientBuffer)
      }else{
        setP(patientBuffer?.slice().filter(e=>e.name==value))
      }
    }

    const getBasics = (name:any) => {
      Axios.post(`${Constant.apihost}/queryEpidemicPerson`,{
        name:name
      })
      .then(e=>{
        setP(e.data.map((e:any)=>({...e.basic,done:e.routes.length})))
        setPB(e.data.map((e:any)=>({...e.basic,done:e.routes.length})))
      })
    } 

    return(
      <MainLayout>
        <div className={sty.Table}>
        <Row>
          <Col span={12}>
            <Search size={"large"} placeholder="输入患者姓名" onSearch={onSearch}/>
          </Col>
          <Col span={12}>
            <EpidChoose size="middle" change={e=>{setCK(e),getBasics(epidemics[e].name)}}/>
          </Col>
        </Row>  
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
}