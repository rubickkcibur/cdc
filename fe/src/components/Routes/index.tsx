import { AutoComplete, Button, Col, Collapse, DatePicker, Form, Input, message, Row, Select, Tag, Tooltip, Menu, Dropdown, Timeline, TimePicker, InputNumber } from 'antd';
import { useForm } from 'antd/lib/form/Form'
import FormItem from 'antd/lib/form/FormItem';
import FormList from 'antd/lib/form/FormList';
import React, { useEffect, useState } from 'react'
import Constant from '../../lib/constant'
import { MinusCircleOutlined, PlusOutlined, CaretRightOutlined, CloseOutlined, MoreOutlined, CarOutlined } from '@ant-design/icons';
import { Moment } from 'moment'
import { SearchInput, strtoll } from '../PathForm';
import trafficData from '../PathForm/traffic.json'
import { NForm, PForm, RForm, TForm } from '../../lib/types/types';
import sty from './index.module.scss';
import moment from 'moment';
import { useTypedSelector } from '../../lib/store';
import { useDispatch } from 'react-redux';
import { ActAddPauses, ActRemovePauses, ActSetShowedRoutes, ActSetState } from '../../lib/state/global';
import Axios from 'axios';

const { Panel } = Collapse
const { Option } = Select;

export interface Contacts { name: string, pid: string }

interface Routes {
    routes: RForm[]
}

const Big = ({str}:any)=><span style={{fontSize:"18px"}}>{str}</span>
    
interface ListProp {
    value?: any,
    initValue?: any,
    onChange?: (e?: any, v?: any) => any
}

function ContactsList({ value, onChange }: ListProp) {
    const [contacts, setCon] = useState<Contacts[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [input, setInput] = useState<string>();
    const getOptions = () => {
        return input == " " ?
            [
                { value: "病例1-周某某-16:00-直线距离0km" },
                { value: "病例7-李某某-18:00-直线距离100m" },
                { value: "病例15-王某-12:00-直线距离1km" }
            ] : []
    }
    const inputConfirm = () => {
        var npid = input?.split(" ")
        if (npid) {
            let tmp = contacts.slice()
            tmp.push({ name: npid[0], pid: npid[1] })
            onChange && onChange(tmp)
            setCon(tmp)
        }
        setVisible(false)
        setInput("")
    }

    useEffect(() => {
        if (value) {
            setCon(value)
        }
    }, [value])

    return (
        <>
            <div className={sty.CloseContact}>
                <Row>
                    <Col style={{ marginTop: '5px' }} span={4}>
                        <Big str="密接者："/>
                    </Col>
                    <Col span={20}>
                        <div className={sty.inputDiv}>
                            {
                                contacts?.map((e, idx) => {
                                    return (
                                        <div className={sty.block}>
                                            <Row><Col>
                                                <Row style={{ height: 2 }}></Row>
                                                &nbsp;{e.name + "(" + e.pid.substr(12, 6) + ")"}
                                            </Col>
                                                <Col className={sty.deleteIcon}>
                                                    <Tooltip title="删除">
                                                        <Button size="small"
                                                            onClick={() => {
                                                                let tmp = contacts.slice();
                                                                tmp.splice(idx, 1);
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
                                <div className={sty.input}>
                                    {/* <Input onChange={(e)=>{setInput(e.target.value)}} value={input}
                                   onPressEnter={inputConfirm} placeholder="使用空格将姓名和身份证号隔开" bordered={false}/> */}
                                    <AutoComplete options={getOptions()} onChange={(e) => { setInput(e) }} value={input}
                                        placeholder="使用空格将姓名和身份证号隔开" bordered={false} />
                                </div>
                                //<Input type="text" onChange={(e)=>{setInput(e.target.value)}} onPressEnter={inputConfirm}/>
                            }
                        </div>
                    </Col>
                </Row>

            </div>
        </>
    )
}

function Stay({value,onChange}:ListProp){
    const [innerValue,setIV] = useState<number>(30)
    const [unit,setU] = useState<string>("min")

    useEffect(()=>{
        if (value && value.length == 2){
            setIV(parseInt(value[0]))
            setU(value[1])
        }
    },[value])
    return(
        <div>
            <Row>
                <Col span={14}>
                    <InputNumber value={innerValue} min={0} onChange={(v)=>{setIV(v as number),onChange && onChange([String(v),unit])}}/>
                </Col>
                <Col span={10}>
                    <Select value={unit} onChange={(value)=>{setU(value),onChange && onChange([String(innerValue),value as string])}}>
                        <Select.Option value={"min"}>分钟</Select.Option>
                        <Select.Option value={"hour"}>小时</Select.Option>
                    </Select>
                </Col>
            </Row>
        </div>
    )
}

interface PFProps {
    value?: PForm | undefined,
    onChange?: (v: any) => void
}

interface TProps {
    value?: string | undefined,
    onChange?: (v: any) => void
}

export function TimeItem({ value, onChange }: TProps) {
    return (
        <TimePicker
            value={value ? moment(value, "HH:mm:ss") : null}
            onChange={(time: Moment | null, timeString: string) => { onChange && onChange(timeString) }}
        />
    )
}

export function PauseForm({ value, onChange }: PFProps) {
    const [form] = useForm<PForm | undefined>();
    const [options,setOptions] = useState<any[]>([])
    const loadedEpiKey = useTypedSelector(e=>e.PAGlobalReducer.loadedEpiKey)
    const epidemics = useTypedSelector(e=>e.PAGlobalReducer.epidemics)
    useEffect(() => {
        if (value && form) {
            console.log("pf init")
            console.log(value)
            form.setFieldsValue(value)
        }
    }, [value])

    const onFormChange = () => {
        console.log("pf change")
        console.log(form.getFieldsValue())
        onChange && onChange(form.getFieldsValue())
        console.log(form.getFieldsValue())
    }

    const onSearch = () => {
        let location = form.getFieldValue("location")
        if (location){
            Axios.post(`${Constant.apihost}/queryDetailLocation`,{
                location:location.location,
                epidemic:epidemics[loadedEpiKey].name,
                //date:"2020-12-11"
            }).then(e=>{
                console.log(e.data)
                setOptions(e.data)
            })
        }else{
            setOptions([])
        }
    }

    return (
        <div>
            <Form form={form} onValuesChange={onFormChange}>
                <Row>
                    <Col span={8}>
                        <FormItem label={<Big str="时间"/>} name={"time"} rules={[{ required: true }]} style={{ padding: '8px 0' }}>
                            <TimeItem></TimeItem>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={<Big str="停留"/>} name={"stay"} rules={[{ required: true }]} style={{ padding: '8px 0' }}>
                            <Stay/>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={<Big str="保护措施"/>} name={"protection"} rules={[{ required: true }]} style={{ padding: '8px 0' }}>
                            <Input/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem style={{ marginTop: '-20px' }} label={<Big str="地点"/>} name={"location"} rules={[{ required: true }]}>
                            <SearchInput placeholder={"搜索地点"} />
                        </FormItem>
                    </Col>
                    <Col span={2}/>
                    <Col span={11}>
                        <FormItem style={{ marginTop: '-20px' }} label={<Big str="详细地点"/>} name={"detail_location"} >
                            {/* <Input/> */}
                            <AutoComplete placeholder={"详细地址"} onSearch={onSearch} options={options.map((e)=>({
                                label:e.detail_location + "-" + e.relate_basic.name + "(" + e.relate_basic.personal_id + ")",
                                value:e.detail_location
                            }))}/>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem name={"contacts"} style={{ marginTop: '-12px' }}>
                    <ContactsList />
                </FormItem>
            </Form>
        </div>
    )
}

interface TFProps {
    value?: TForm | undefined,
    onChange?: (v: any) => void
}

export function TravelForm({ value, onChange }: TFProps) {
    const [form] = useForm<TForm>()

    useEffect(() => {
        if (value && form) {
            console.log("tf init")
            console.log(value)
            form.setFieldsValue(value)
        }
    }, [value])

    const onFormChange = () => {
        console.log("tf change")
        console.log(form.getFieldsValue())
        onChange && onChange(form.getFieldsValue())
    }

    return (
        <div>
            <Form form={form} onValuesChange={onFormChange}>
                <Row>
                    <Col span={5} style={{ textAlign: 'right' }}>
                        <CarOutlined style={{ fontSize: '20px', marginTop: '5px', marginRight: '5px' }} />
                    </Col>
                    <Col span={5}>
                        <FormItem name={"transform"}>
                            <Select placeholder={"出行方式"} >
                                {trafficData.map(e => (<Select.Option key={e} value={e}>{e}</Select.Option>))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={5}>
                        <FormItem name={"note"}>
                            <Input placeholder={"补充说明"} />
                        </FormItem>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={5}>
                        <FormItem name={"protection"}>
                            <Input placeholder={"防护措施"}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={3}></Col>
                    <Col span={21}>
                        <FormItem name={"contacts"}>
                            <ContactsList/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

interface NFProps {
    idx?: number
    value?: NForm | undefined,
    onChange?: (v: any) => void
}

export function NodeForm({ idx, value, onChange }: NFProps) {
    const [form] = useForm<NForm>();
    const dispatch = useDispatch();
    useEffect(() => {
        if (value && form) {
            console.log("nf init")
            console.log(value)
            form.setFieldsValue(value)
        }
    }, [value])

    const onFormChange = () => {
        console.log("nf change")
        console.log(form.getFieldsValue())
        if (form.getFieldsValue().pause?.location) {
            console.log("dispatch")
            dispatch(ActAddPauses(idx ?? 0, {
                name: form.getFieldsValue().pause?.location?.name ?? "",
                lnglat: strtoll(form.getFieldsValue().pause?.location?.location ?? "")
            }))
        }
        onChange && onChange(form.getFieldsValue())
        console.log(form.getFieldsValue())
    }

    return (
        <Form form={form} onValuesChange={onFormChange}>
            <FormItem name={"travel"} style={{ marginTop: '-60px' }}>
                {
                    idx ? <TravelForm /> : <div style={{ height: '55px' }}> </div>
                }
            </FormItem>
            <FormItem name={"pause"} style={{ marginTop: '-30px' }}>
                <PauseForm />
            </FormItem>
        </Form>
    )
}

interface RFProps {
    value?: RForm | undefined,
    onChange?: (v: any) => void,
    idx?: number
}

interface DProps {
    value?: string | undefined,
    onChange?: (v: any) => void,
    idx?: number
}

function Date({ value, onChange, idx }: DProps) {
    const [innerV, setV] = useState<Moment>()
    const dispatch = useDispatch()
    const [show, setS] = useState<boolean>(false)

    const onPickerChange = (date: Moment | null, dateString: String) => {
        console.log("Date",dateString)
        onChange && onChange(dateString)
    }

    useEffect(() => {
        if (value) {
            setV(moment(value))
        }
    }, [value])

    const onButtonClick = (idx:number) => {
        setS(!show), dispatch(ActSetShowedRoutes(idx - 1))
    }

    return (
        // <div style={{
        //     "display":"flex",
        //     "flexDirection":"row",
        //     "justifyContent":"space-between"
        // }}>
        <div>
            <DatePicker className={sty.dateStyle}
                bordered={false}
                size={"large"}
                value={innerV}
                onChange={onPickerChange}
                onClick={(e)=>e.stopPropagation()}
            />
            {
                idx &&
                <Button onClick={(e) => {
                    e.stopPropagation()
                    onButtonClick(idx)
                 }}>{show ? "隐藏" : "展示"}</Button>
            }
        </div>
    )
}

export function RouteForm({ value, onChange, idx }: RFProps) {
    const oneNode: NForm[] = [
        {
            travel: {
                transform: undefined,
                note: undefined,
                protection:"",
                contacts:[]
            },
            pause: {
                time: undefined,
                stay:[],
                location: undefined,
                contacts: [],
                detail_location:"",
                protection:""
            }
        }
    ]

    const [form] = useForm<RForm>();
    const dispatch = useDispatch()
    useEffect(() => {
        if (value && form) {
            form.setFieldsValue(value)
        }
    }, [value])

    useEffect(() => {
        if (!form.getFieldValue("route") || form.getFieldValue("route").length === 0) {
            form.setFieldsValue({ date: "12-6-2020", route: oneNode.slice() })
        }
    }, [form])

    return (
        <Form form={form} onValuesChange={() => { onChange && onChange(form.getFieldsValue()) }}>
            <Collapse expandIcon={({ isActive }) => <CaretRightOutlined style={{ fontSize: 20 }} rotate={isActive ? 90 : 0} />}>
                <Panel key="1" header={
                    <FormItem name={"date"} noStyle>
                        <Date idx={idx} />
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
                                                                <NodeForm idx={index} />
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
                                                    <div style={{ marginTop: '38px' }}>
                                                        <Dropdown
                                                            arrow overlay={<Menu>
                                                                <Menu.Item>
                                                                    <Button onClick={() => add(Object.create(oneNode[0]), index)} type="link">
                                                                        在上方增加项
                                                                    </Button>
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    <Button onClick={() => add(Object.create(oneNode[0]))} type="link">
                                                                        在下方增加项
                                                                    </Button>
                                                                </Menu.Item>
                                                                <Menu.Item danger>
                                                                    <Button disabled={!form.getFieldValue("route") || form.getFieldValue("route").length <= 1}
                                                                        onClick={() => { remove(field.name), dispatch(ActRemovePauses(index)) }} type="link">
                                                                        删除该项
                                                                    </Button>
                                                                </Menu.Item>
                                                            </Menu>}>
                                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                                <MoreOutlined style={{ fontSize: '20px' }} />
                                                            </a>
                                                        </Dropdown>
                                                    </div>
                                                </Col>
                                            </Row>

                                            {index === form.getFieldValue("route").length - 1 ?
                                                <Button onClick={() => add(Object.create(oneNode[0]))}>
                                                    <PlusOutlined />
                                                </Button>
                                                : null}
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

const oneRoute: RForm = {
    date: "6/12/2020",
    route: []
}

export default function Routes() {
    const [form] = useForm<Routes>()
    const loadedRoutes = useTypedSelector(e => e.PAGlobalReducer.loadedRoutes)

    useEffect(() => {
        if (loadedRoutes) {
            form.setFieldsValue({ routes: loadedRoutes })
            console.log(loadedRoutes)
        }
    }, [loadedRoutes, form])

    // useEffect(()=>{
    //     if (!form.getFieldValue("routes") || form.getFieldValue("routes").length===0){
    //         form.setFieldsValue({routes:[oneRoute]})
    //     }
    // })

    return (
        <Form form={form} onValuesChange={() => console.log(form.getFieldsValue())}>
            <FormList name="routes">
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <FormItem {...field} noStyle>
                                <RouteForm idx={index + 1} />
                            </FormItem>
                        ))}
                    </>
                )}
            </FormList>
        </Form>
    )

}