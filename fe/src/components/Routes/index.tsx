import { AutoComplete, Button, Col, Collapse, DatePicker, Form, Input, message, Row, Select, Tag, Tooltip, Menu, Dropdown,Timeline,TimePicker } from 'antd';
import { useForm } from 'antd/lib/form/Form'
import FormItem from 'antd/lib/form/FormItem';
import FormList from 'antd/lib/form/FormList';
import React, { useEffect, useState } from 'react'
import {Tip} from '../../lib/search'
import { MinusCircleOutlined, PlusOutlined,CaretRightOutlined,CloseOutlined,MoreOutlined,CarOutlined } from '@ant-design/icons';
import {Moment} from 'moment'
import { SearchInput, strtoll } from '../PathForm';
import trafficData from '../PathForm/traffic.json'
import { NForm, PForm, RForm, TForm } from '../../lib/types/types';
import sty from './index.module.scss';
import moment from 'moment';
import { useTypedSelector } from '../../lib/store';
import { useDispatch } from 'react-redux';
import { ActAddPauses, ActRemovePauses, ActSetShowedRoutes, ActSetState } from '../../lib/state/global';

const { Panel } = Collapse


export interface Contacts {name :string, pid:string}

interface Routes{
    routes:RForm[]
}

interface ListProp {
    value?:any,
    initValue?:any,
    onChange?:(e?:any,v?:any)=>any
}

function ContactsList({value,onChange}:ListProp){
    const [contacts,setCon] = useState<Contacts[]>([]);
    const [visible,setVisible] = useState<boolean>(false);
    const [input,setInput] = useState<string>();
    const options=[
        {value:"病例1-周某某-16:00-直线距离0km"},
        {value:"病例7-李某某-18:00-直线距离100m"},
        {value:"病例15-王某-12:00-直线距离1km"}
    ]
    const inputConfirm = ()=>{
        var npid = input?.split(" ")
        if (npid){
            let tmp = contacts.slice()
            tmp.push({name:npid[0], pid:npid[1]})
            onChange && onChange(tmp)
            setCon(tmp)
        }
        setVisible(false)
        setInput("")
    }

    useEffect(()=>{
        if (value){
            setCon(value)
        }
    },[value])

    return(
        <>
            <div className={sty.CloseContact}>
                <div className={sty.inputDiv}>
                    {
                        contacts?.map((e,idx)=>{
                            return(
                                <div className={sty.block}>
                                    <Row><Col>
                                        <Row style={{height:2}}></Row>
                                        &nbsp;{e.name+"(" + e.pid.substr(12,6) + ")"}
                                    </Col>
                                        <Col className={sty.deleteIcon}>
                                            <Tooltip title="删除">
                                                <Button size="small"
                                                        onClick={()=>{
                                                            let tmp = contacts.slice();
                                                            tmp.splice(idx,1);
                                                            setCon(tmp);
                                                            onChange && onChange(tmp)
                                                        }}
                                                        shape="circle" icon={<CloseOutlined />} />
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </div>)
                        })
                    }
                    {
                        //visible&&
                        <div  className={sty.input}>
                            {/* <Input onChange={(e)=>{setInput(e.target.value)}} value={input}
                                   onPressEnter={inputConfirm} placeholder="使用空格将姓名和身份证号隔开" bordered={false}/> */}
                            <AutoComplete options={options} onChange={(e)=>{setInput(e)}} value={input}
                                placeholder="使用空格将姓名和身份证号隔开" bordered={false}/>
                        </div>
                         //<Input type="text" onChange={(e)=>{setInput(e.target.value)}} onPressEnter={inputConfirm}/>
                    }
                </div>
            </div>
        </>
    )
}

interface PFProps{
    value?:PForm|undefined,
    onChange?:(v:any)=>void
}

interface TProps{
    value?:string|undefined,
    onChange?:(v:any)=>void
}

function TimeItem({value,onChange}:TProps){
    return(
        <TimePicker
            value={value?moment(value,"HH:mm:ss"):null}
            onChange={(time:Moment|null,timeString:string)=>{onChange && onChange(timeString)}}
        />
    )
}

export function PauseForm({value,onChange}:PFProps){
    const [form] = useForm<PForm|undefined>();
    useEffect(()=>{
        if(value && form){
            console.log("pf init")
            console.log(value)
            form.setFieldsValue(value)
        }
    },[value])

    const onFormChange=()=>{
        console.log("pf change")
        console.log(form.getFieldsValue())
        onChange && onChange(form.getFieldsValue())
        console.log(form.getFieldsValue())
    }

    return(
        <div>
            <Form form={form} onValuesChange={onFormChange}>
                <Row gutter={16}>
                    <Col className="gutter-row" span={12}>
                        <FormItem name={"time"} rules={[{ required: true }]} style={{padding:'8px 0'}}>
                            <TimeItem></TimeItem>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <FormItem name={"location"} style={{ margin: "0",padding:'8px 0' }} rules={[{ required: true }]}>
                            <SearchInput placeholder={"搜索地点"} />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem name={"contacts"} style={{marginTop:'0px'}}>
                    <ContactsList/>
                </FormItem>
            </Form>
        </div>
    )
}

interface TFProps{
    value?:TForm|undefined,
    onChange?:(v:any)=>void
}

export function TravelForm({value,onChange}:TFProps){
    const [form] = useForm<TForm>()

    useEffect(()=>{
        if (value && form){
            console.log("tf init")
            console.log(value)
            form.setFieldsValue(value)
        }
    },[value])

    const onFormChange = ()=>{
        console.log("tf change")
        console.log(form.getFieldsValue())
        onChange && onChange(form.getFieldsValue())
    }

    return(
        <div>
            <Form form={form} onValuesChange={onFormChange}>
                <Row>
                    <Col span={5} style={{textAlign:'right'}}>
                        <CarOutlined style={{fontSize:'20px',marginTop:'5px',marginRight:'5px'}}/>
                    </Col>
                    <Col span={9}>
                        <FormItem name={"transform"}>
                            <Select placeholder={"出行方式"} >
                                {trafficData.map(e => (<Select.Option key={e} value={e}>{e}</Select.Option>))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={9}>
                        <FormItem name={"note"}>
                            <Input placeholder={"补充说明"} />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

interface NFProps{
    idx?:number
    value?:NForm|undefined,
    onChange?:(v:any)=>void
}

export function NodeForm({idx,value,onChange}:NFProps){
    const [form] = useForm<NForm>();
    const dispatch = useDispatch();
    useEffect(()=>{
        if (value && form){
            console.log("nf init")
            console.log(value)
            form.setFieldsValue(value)
        }
    },[value])

    const onFormChange = ()=>{
        console.log("nf change")
        console.log(form.getFieldsValue())
        if (form.getFieldsValue().pause?.location){
            console.log("dispatch")
            dispatch(ActAddPauses(idx??0,{
                name:form.getFieldsValue().pause?.location?.name ?? "",
                lnglat:strtoll(form.getFieldsValue().pause?.location?.location ?? "")
            }))
        }
        onChange && onChange(form.getFieldsValue())
        console.log(form.getFieldsValue())
    }

    return(
        <Form form={form} onValuesChange={onFormChange}>
            <FormItem name={"travel"} style={{marginTop:'-60px'}}>
                {
                    idx?<TravelForm/>:<div style={{height:'55px'}}> </div>
                }
            </FormItem>
            <FormItem name={"pause"} style={{marginTop:'-30px'}}>
                <PauseForm/>
            </FormItem>
        </Form>
    )
}

interface RFProps{
    value?:RForm|undefined,
    onChange?:(v:any)=>void,
    idx?:number
}

interface DProps{
    value?:string|undefined,
    onChange?:(v:any)=>void,
    idx?:number
}

function Date({value,onChange,idx}:DProps){
    const [innerV,setV] = useState<Moment>()
    const dispatch = useDispatch()
    const [show,setS] = useState<boolean>(false)

    const onPickerChange=(date:Moment|null,dateString:String)=>{
        onChange && onChange(dateString)
    }

    useEffect(()=>{
        if(value){
            setV(moment(value))
        }
    },[value])

    return(
        <>
        <DatePicker className={sty.dateStyle}
                    bordered={false}
                    size={"large"}
                    value={innerV}
                    onChange={onPickerChange}
        />
        {
            idx && 
            <Button onClick={()=>{setS(!show),dispatch(ActSetShowedRoutes(idx-1))}}>{show?"hide":"show"}</Button>
        }
        </>
    )
}

export function RouteForm({value,onChange,idx}:RFProps){
    const oneNode:NForm[] = [
        {
            travel:{
                transform:undefined,
                note:undefined
            },
            pause:{
                time:undefined,
                location:undefined,
                contacts:[]
            }}
    ]

    const [form] = useForm<RForm>();
    const dispatch = useDispatch()
    useEffect(()=>{
        if (value && form){
            form.setFieldsValue(value)
        }
    },[value])

    useEffect(()=>{
        if (!form.getFieldValue("route") || form.getFieldValue("route").length === 0){
            form.setFieldsValue({date:"12-6-2020",route:oneNode.slice()})
        }
    },[form])

    return(
        <Form form={form} onValuesChange={()=>{onChange && onChange(form.getFieldsValue())}}>
            <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{fontSize:20}} rotate={isActive ? 90 : 0} />}>
                <Panel key="1" header={
                    <FormItem name={"date"} noStyle>
                        <Date idx={idx}/>
                    </FormItem>
                    //<Date/>
                }>
                    <Timeline>
                        <Form.List
                            name="route"
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <>
                                            {/*<Button onClick={()=>add(Object.create(oneNode[0]),index)}>*/}
                                            {/*  <PlusOutlined/>*/}
                                            {/*</Button>*/}

                                                <Row>
                                                <Col span={23}>
                                                    <Timeline.Item>
                                                <FormItem key={field.key}>
                                                    <FormItem {...field} noStyle>
                                                         <NodeForm idx={index}/>
                                                    </FormItem>
                                                    {/*<Button*/}
                                                    {/*disabled={!form.getFieldValue("route") || form.getFieldValue("route").length <= 1}*/}
                                                    {/*onClick={()=>remove(field.name)}*/}
                                                    {/*>*/}
                                                    {/*  <MinusCircleOutlined/>*/}
                                                    {/*</Button>*/}
                                                </FormItem>
                                                    </Timeline.Item>
                                                </Col>
                                                <Col span={1}>
                                                        <div style={{marginTop:'20px'}}>
                                                            <Dropdown
                                                                arrow overlay={<Menu>
                                                                <Menu.Item>
                                                                    <Button onClick={()=>add(Object.create(oneNode[0]),index)} type="link">
                                                                        在上方增加项
                                                                    </Button>
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    <Button onClick={()=>add(Object.create(oneNode[0]))} type="link">
                                                                        在下方增加项
                                                                    </Button>
                                                                </Menu.Item>
                                                                <Menu.Item danger>
                                                                    <Button disabled={!form.getFieldValue("route") || form.getFieldValue("route").length <= 1}
                                                                            onClick={()=>{remove(field.name),dispatch(ActRemovePauses(index))}} type="link">
                                                                        删除该项
                                                                    </Button>
                                                                </Menu.Item>
                                                            </Menu>}>
                                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                                    <MoreOutlined style={{fontSize:'20px'}}/>
                                                                </a>
                                                            </Dropdown>
                                                        </div>
                                                    </Col>
                                                </Row>

                                            {index === form.getFieldValue("route").length-1?
                                                <Button onClick={()=>add(Object.create(oneNode[0]))}>
                                                    <PlusOutlined/>
                                                </Button>
                                                :null}
                                        </>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Timeline>
                </Panel>
            </Collapse>
        </Form>
    )
}

const oneRoute:RForm={
    date:"6/12/2020",
    route:[]
}

export default function Routes(){
    const [form] = useForm<Routes>()
    const loadedRoutes = useTypedSelector(e=>e.PAGlobalReducer.loadedRoutes)

    useEffect(()=>{
        if(loadedRoutes){
            form.setFieldsValue({routes:loadedRoutes})
            console.log(loadedRoutes)
        }
    },[loadedRoutes,form])

    // useEffect(()=>{
    //     if (!form.getFieldValue("routes") || form.getFieldValue("routes").length===0){
    //         form.setFieldsValue({routes:[oneRoute]})
    //     }
    // })

    return(
        <Form form={form} onValuesChange={()=>console.log(form.getFieldsValue())}>
            <FormList name="routes">
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <FormItem {...field} noStyle>
                                <RouteForm idx={index+1}/>
                            </FormItem>
                        ))}
                    </>
                )}
            </FormList>
        </Form>
    )

}