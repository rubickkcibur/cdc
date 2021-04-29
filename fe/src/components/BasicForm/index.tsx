import { Cascader, DatePicker, Select, TimePicker,InputNumber,AutoComplete } from "antd"
import Form, { FormInstance, useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import { Col } from "antd/lib/grid"
import Row from "antd/lib/grid/row"
import Input from "antd/lib/input/Input"
import React, {useEffect, useState} from "react"
import { useTypedSelector } from "../../lib/store"
import { TimeItem } from "../Routes"
import PCAData from './data.json'
import APData from './apdata.json'
import countryData from './countryData.json'
import {country} from './countryList'
import moment,{Moment} from 'moment';
import {Basic, Overseas, PForm} from "../../lib/types/types";
import { useDispatch } from "react-redux"
import { ActSetShowedRoutes } from "../../lib/state/global"
//import {Date} from "../Routes"

interface ATProps {
    value?:any,
    initValue?:any,
    onChange?:(e?:any,v?:any)=>any
}

const Big = ({str}:{str:string})=><span style={{fontSize:"18px"}}>{str}</span>

export function ArrivalTransport({value,onChange}:ATProps){
    const halfItemGrid = { md: { span: 12 } };
    const fullItemGrid = { md: { span: 24 } };
    const halfGutter: [number, number] = [32, 15];
    const itemStyle: React.CSSProperties = { margin: "0" };
    const [arrival_transport,setIV] = useState<string[]>(["",""])
    useEffect(()=>{
        if (value && value.length==2){
            setIV(value)
        }
    },[value])
    return(
        <Row gutter={halfGutter}>
            <Col {...halfItemGrid}>
                <FormItem label={<Big str="交通方式"/>} style={itemStyle} rules={[{ required: true }]}>
                <Select onChange={(e)=>{
                    let temp = arrival_transport?.slice()
                    if (temp){
                        temp[0] = e as string
                    }
                    setIV(temp)
                    onChange && onChange(temp)
                }}>
                    <Select.Option value="air">飞机</Select.Option>
                    <Select.Option value="train">火车</Select.Option>
                    <Select.Option value="ship">轮船</Select.Option>
                </Select>
                </FormItem>
            </Col>
            <Col {...halfItemGrid}>
                <FormItem label={<Big str="车/船/机次"/>} style={itemStyle} rules={[{ required: true }]}>
                <Input onChange={(e)=>{
                    let temp = arrival_transport?.slice()
                    if (temp){
                        temp[1] = e.target.value
                    }
                    setIV(temp)
                    onChange && onChange(temp)
                }}/>
                </FormItem>
            </Col>
        </Row>
    )
}


function Date({ value, onChange, idx }: {
    value?: string | undefined,
    onChange?: (v: any) => void,
    idx?: number}) {
    const [innerV, setV] = useState<Moment>()

    const onPickerChange = (date: Moment | null, dateString: String) => {
        onChange && onChange(dateString)
    }

    useEffect(() => {
        if (value) {
            setV(moment(value))
        }
    }, [value])

    return (
        <DatePicker
            value={innerV}
            onChange={onPickerChange}
        />
    )
}
interface OVProps{
    value?:Overseas|undefined,
    onChange?:(v:any)=>void
}
export function OutSea({value,onChange}:OVProps) {
    const [form] = useForm<Overseas>();
    const halfItemGrid = { md: { span: 12 } };
    const fullItemGrid = { md: { span: 24 } };
    const halfGutter: [number, number] = [32, 15];
    const itemStyle: React.CSSProperties = { margin: "0" };
    const { Option } = Select;

    useEffect(()=>{
        if(value && form){
            console.log("pf init")
            console.log(value)
            form.setFieldsValue(value)
        }
    },[value])

    const onFormChange=()=>{
        console.log("overs change")
        console.log(form.getFieldsValue())
        onChange && onChange(form.getFieldsValue())
        console.log(form.getFieldsValue())
    }

    return(
        <Form form={form} onValuesChange={onFormChange}>
            <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}}>
                <Col {...halfItemGrid}>
                    <FormItem label={<Big str="旅行国家"/>} name={"traveled_country"} style={itemStyle} rules={[{ required: true }]}>
                        <Select mode="multiple" style={{width:'100%',overflowY:'auto',overflowX:'hidden'}} placeholder="请输入前往过的国家">
                            {country}
                        </Select>
                    </FormItem>
                </Col>
                <Col {...halfItemGrid}>
                    <FormItem label={<Big str="经停国家"/>} name={"passing_country"} style={itemStyle} rules={[{ required: true }]}>
                        <Select mode="multiple" style={{width:'100%',overflowY:'auto',overflowX:'hidden'}} placeholder="请输入经停国家">
                            {country}
                        </Select>
                    </FormItem>
                </Col>
            </Row>

            <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}}>
                <Col {...halfItemGrid}>
                    <FormItem label={<Big str="国籍"/>} name={"nation"} style={itemStyle} rules={[{ required: true }]}>

                        <AutoComplete options={countryData} placeholder={"请选择国籍"} filterOption={(inputValue, option) =>
                            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }/>
                    </FormItem>
                </Col>
                <Col {...halfItemGrid}>
                    <FormItem label={<Big str="护照ID"/>} name={"passport_id"} style={itemStyle} rules={[{ required: true }]}>
                        <Input placeholder={"请输入护照ID"} />
                    </FormItem>
                </Col>
            </Row>

            <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}}>
                <Col {...halfItemGrid}>
                    <FormItem label={<Big str="抵达位置"/>} name={"arrival_port"} style={itemStyle} rules={[{ required: true }]}>
                        <Cascader placeholder={"省/机场或车站"} options={APData} />
                    </FormItem>
                </Col>
                <Col {...halfItemGrid}>
                    <FormItem label={<Big str="抵达时间"/>} name={"arrival_date"} style={itemStyle} rules={[{ required: true }]}>
                        {/* <DatePicker style={{width:'100%'}}
                            format="YYYY-MM-DD"
                        /> */}
                        <Date/>
                    </FormItem>
                </Col>
            </Row>

            <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}}>
                <Col {...fullItemGrid}>
                    <FormItem name={"arrival_transport"} style={itemStyle} rules={[{ required: true }]}>
                        <ArrivalTransport/>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}

interface IProps {
    onChange?: (value: any, form: FormInstance) => void
    value?: any
}
export default function FormBasic({ onChange }: IProps) {
  const halfItemGrid = { md: { span: 12 } };
  const threeItemGrid = { md: { span: 8 } };
  const halfGutter: [number, number] = [32, 15];
  const itemStyle: React.CSSProperties = { margin: "0" };
  const [form] = useForm<Basic>();
  const loaded_form = useTypedSelector(e => e.PAGlobalReducer.loaded_form);
  const loadedBasic = useTypedSelector(e=>e.PAGlobalReducer.loadedBasic);
  const { Option } = Select;
  const [outPatient,setOutPatient] = useState<boolean>(false);

  function isOutPatient(value:any){
      if(value=='yes'){
          setOutPatient(true)
      }
      else{
          setOutPatient(false)
      }
  }

  useEffect(() => {
    if (loadedBasic)
      form.setFieldsValue(loadedBasic)
  }, [loadedBasic, form])

  const onValueChange = (changed: any, values: any) => {
    onChange && onChange(values, form)
  }
  useEffect(() => { onChange && onChange(undefined, form) }, [form])


  return (
    <Form style={{height:'750px',overflowX:'hidden',overflowY:'auto'}} onValuesChange={onValueChange} form={form}>
      <Row gutter={halfGutter} style={{marginTop:'10px',marginRight:'12px',marginLeft:'8px'}}>
          <Col {...threeItemGrid}>
            <FormItem label={<Big str="姓名"/>} name={"name"} style={itemStyle} rules={[{ required: true }]}>
              <Input placeholder={"请输入姓名"} />
            </FormItem>
          </Col>
          <Col {...threeItemGrid}>
              <FormItem label={<Big str="性别"/>} name={"gender"} initialValue={"male"} style={itemStyle} rules={[{ required: true }]}>
                  <Select>
                      <Select.Option value={"male"}> 男</Select.Option>
                      <Select.Option value={"female"}>女</Select.Option>
                  </Select>
              </FormItem>
          </Col>
          <Col {...threeItemGrid}>
              <FormItem label={<Big str="年龄"/>} name={"age"} style={itemStyle} rules={[{ required: true }]}>
                  <Input placeholder={"请输入年龄"} />
              </FormItem>
          </Col>
      </Row>

      <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}}>
            <Col {...threeItemGrid}>
                <FormItem label={<Big str="身高"/>} name={"height"} style={itemStyle} rules={[{ required: false }]}>
                    <InputNumber style={{width:'100%'}} formatter={value => `${value}cm`}
                        parser={value => value?value.replace('cm', ''):'0'} placeholder={"请输入身高(cm)"} />
                </FormItem>
            </Col>
            <Col {...threeItemGrid}>
                <FormItem label={<Big str="体重"/>} name={"weight"} style={itemStyle} rules={[{ required: false }]}>
                    <InputNumber style={{width:'100%'}} formatter={value => `${value}kg`}
                        parser={value => value?value.replace('kg', ''):'0'} placeholder={"请输入体重(kg)"} />
                </FormItem>
            </Col>
          <Col {...threeItemGrid}>
              <FormItem label={<Big str="确诊时间"/>} name={"time"} style={itemStyle} rules={[{ required: false }]}>
                  {/* <DatePicker
                      format="YYYY-MM-DD"
                  /> */}
                  <Date/>
              </FormItem>
          </Col>
      </Row>

      <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}} >
          <Col {...halfItemGrid}>
            <FormItem label={<Big str="电话"/>} name={"phone"} style={itemStyle} rules={[{ required: true }]}>
              <Input placeholder={"请输入电话"} />
            </FormItem>
          </Col>
          <Col {...halfItemGrid}>
              <FormItem label={<Big str="身份证"/>} name={"personal_id"} style={itemStyle} rules={[{ required: true }]}>
                  <Input placeholder={"请输入身份证号"} />
              </FormItem>
          </Col>
      </Row>

      <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}}>
          <Col {...halfItemGrid}>
            <FormItem label={<Big str="住址"/>} name={"addr1"} style={itemStyle} rules={[{ required: true }]}>
              <Cascader placeholder={"省/市/区"} options={PCAData} />
            </FormItem>
          </Col>
          <Col {...halfItemGrid}>
              <FormItem label={<Big str="地址"/>} name={"addr2"} style={itemStyle} rules={[{ required: true }]}>
                  <Input placeholder={"县/街道"} />
              </FormItem>
          </Col>
      </Row>

      <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}}>
        <Col {...halfItemGrid}>
          <FormItem label={<Big str="职业"/>} name={"vocation"} style={itemStyle} rules={[{ required: false }]}>
            <Input placeholder={"请输入职业"} />
          </FormItem>
        </Col>
          <Col {...halfItemGrid}>
              <FormItem label={<Big str="工作地点"/>} name={"working_place"} style={itemStyle} rules={[{ required: false }]}>
                  <Input placeholder={"请输入工作地点"} />
              </FormItem>
          </Col>
      </Row>

      <Row gutter={halfGutter} style={{marginRight:'12px',marginLeft:'8px'}}>
          <Col {...halfItemGrid}>
              <FormItem label={<Big str="是否境外输入"/>} name={"isOut"}  initialValue={"no"} style={itemStyle} rules={[{ required: true }]}>
                  <Select onChange={isOutPatient}>
                      <Option value="yes">是</Option>
                      <Option value="no">否</Option>
                  </Select>
              </FormItem>
          </Col>
      </Row>

      <FormItem name={"overseas"}>
          {outPatient?<OutSea/>:<Row/>}
      </FormItem>

    </Form>
  )
}
