import { AutoComplete, Button, Col, Collapse, DatePicker, Form, Input, message, Row, Select, Tag } from 'antd';
import { useForm } from 'antd/lib/form/Form'
import FormItem from 'antd/lib/form/FormItem';
import FormList from 'antd/lib/form/FormList';
import React, { useEffect, useState } from 'react'
import {Tip} from '../../lib/search'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {Moment} from 'moment'
import { SearchInput } from '../PathForm';
import trafficData from '../PathForm/traffic.json'
import { NForm, PForm, RForm, TForm } from '../../lib/types/types';

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
  const inputConfirm = ()=>{
    var npid = input?.split(" ")
    if (npid){
      let tmp = contacts.slice()
      tmp.push({name:npid[0], pid:npid[1]})
      onChange && onChange(tmp)
      setCon(tmp)
    }
    setVisible(false)
  }

  useEffect(()=>{
    if (value){
      setCon(value)
    }
  },[value])

  return(
    <>
      {
        contacts?.map((e,idx)=>{
          return(
          <Tag closable 
            style={{ width: 78 }}
            key={idx}
            onClose={()=>{
            let tmp = contacts.slice();
            tmp.splice(idx,1);
            setCon(tmp);
            onChange && onChange(tmp)
          }}>
            {e.name+"(" + e.pid.substr(12,6) + ")"}
          </Tag>)
        })
      }
      {
        visible && 
        <Input type="text" onChange={(e)=>{setInput(e.target.value)}} onPressEnter={inputConfirm}/>
      }
      {
        !visible &&
        <Tag onClick={()=>{setVisible(true)}}>
          <PlusOutlined/>使用空格将姓名和身份证号隔开
        </Tag>
      }
    </>
  )
}

interface PFProps{
  value?:PForm|undefined,
  onChange?:(v:any)=>void
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
        <FormItem name={"time"} rules={[{ required: true }]}>
          <DatePicker showTime placeholder={"输入日期"} />
        </FormItem>
        <FormItem name={"location"} style={{ margin: "0" }} rules={[{ required: true }]}>
          <SearchInput placeholder={"搜索地点"} />
        </FormItem>
        <FormItem name={"contacts"}>
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
    console.log(form.getFieldsValue())
  }

  return(
    <div>
      <Form form={form} onValuesChange={onFormChange}>
        <FormItem name={"trasform"}>
          <Select placeholder={"出行方式"} >
            {trafficData.map(e => (<Select.Option key={e} value={e}>{e}</Select.Option>))}
          </Select>
        </FormItem>
        <FormItem name={"note"}>
          <Input placeholder={"补充说明"} />
        </FormItem>
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
    onChange && onChange(form.getFieldsValue())
    console.log(form.getFieldsValue())
  }

  return(
    <Form form={form} onValuesChange={onFormChange}>
      <FormItem name={"travel"}>
        {
          idx?<TravelForm/>:null
        }
      </FormItem>
      <FormItem name={"pause"}>
        <PauseForm/>
      </FormItem>
    </Form>
  )
}

interface RFProps{
  value?:RForm|undefined,
  onChange?:(v:any)=>void
}

interface DProps{
  value?:string|undefined,
  onChange?:(v:any)=>void
}

function Date({value,onChange}:DProps){
  return(
    <h1>{value}</h1>
  )
}

export function RouteForm({value,onChange}:RFProps){
  const oneNode:NForm[] = [
    {
    travel:{
      trasform:undefined,
      note:undefined
    },
    pause:{
      time:undefined,
      location:undefined,
      contacts:[]
    }}
  ]
  const [form] = useForm<RForm>();
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
      <Collapse>
      <Panel key="1" header={
        <FormItem name={"date"} noStyle>
          <Date/>
        </FormItem>
      }>
      <Form.List
        name="route"
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <>
                  <Button onClick={()=>add(Object.create(oneNode[0]),index)}>
                    <PlusOutlined/>
                  </Button>
                  <FormItem key={field.key}>
                    <FormItem {...field} noStyle>
                      <NodeForm idx={index}/>
                    </FormItem>
                    <Button
                    disabled={!form.getFieldValue("route") || form.getFieldValue("route").length <= 1} 
                    onClick={()=>remove(field.name)}
                    >
                      <MinusCircleOutlined/>
                    </Button>
                  </FormItem>
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

    useEffect(()=>{
        if (!form.getFieldValue("routes") || form.getFieldValue("routes").length===0){
            form.setFieldsValue({routes:[oneRoute]})
        }
    })

    return(
        <Form form={form} onValuesChange={()=>console.log(form.getFieldsValue())}>
            <FormList name="routes">
            {(fields, { add, remove }, { errors }) => (
                <>
                    {fields.map((field, index) => (
                        <FormItem {...field} noStyle>
                            <RouteForm/>
                        </FormItem>
                    ))}
                </>
            )}
            </FormList>
        </Form>
    )

}