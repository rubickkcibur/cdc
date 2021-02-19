import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { AutoComplete, Button, Col, DatePicker, Input, message, Row, Select } from "antd"
import Form, { FormInstance, useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import produce from "immer"
import moment from "moment"
import { type } from "os"
import React, { useCallback, useEffect, useState } from "react"
import { LngLatPos } from "react-amap"
import { useDispatch } from "react-redux"
import { dispatch } from "rxjs/internal/observable/pairs"
import Search, { Tip } from "../../lib/search"
import { ActAddPauses, ActRemovePauses, ActUpdateValue } from "../../lib/state/global"
import { useTypedSelector } from "../../lib/store"
import { BaseItem } from "../../lib/types/types"
import sty from "./index.module.scss"
import TrafficData from './traffic.json'

interface IElementProps {

  pos?: {
    last?: boolean
    first?: boolean
    idx: number
  }
  initValue?: any
  value?: any
  onChange?: (v?: IV, e?: any[]) => any
}


const ConjectionElement = ({ onChange, initValue }: IElementProps) => {
  const itemGrid = { span: 12 }
  const gutterValue: { gutter: [number, number] } = { gutter: [8, 8] }
  const formItemSty = { margin: "0" }
  const [form] = useForm()
  const onValuesChange = (cv: any, v: any) => {
    onChange && onChange(form.getFieldsValue(), form.getFieldsError())
  }
  useEffect(() => {
    if (form && initValue)
      form.setFieldsValue(initValue.edges)

  }, [initValue, form])

  return (
    <div className={sty.DouFormRoot}>
      <div className={sty.Guide} >
        <div className={sty.Dot} />
        <div className={sty.Line} />
      </div>
      <Form onValuesChange={onValuesChange} form={form} style={{ flex: "1 1 auto" }}>
        <Row {...gutterValue} >
          <Col {...itemGrid}>
            <FormItem name={"traffic"} style={formItemSty}>
              <Select placeholder={"出行方式"} >
                {TrafficData.map(e => (<Select.Option key={e} value={e}>{e}</Select.Option>))}
              </Select>
            </FormItem>
          </Col>
          <Col {...itemGrid}>
            <FormItem name={"description"} style={formItemSty}>
              <Input placeholder={"补充说明"} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

interface InputIProps { value?: any, onChange?: (v: string) => void, placeholder: string }

export const SearchInput = ({ onChange, placeholder, value }: InputIProps) => {
  const [res, setRes] = useState<any>(undefined)
  const [innervalue, setV] = useState<string>("")
  function renderItems(data: any) {
    return data?.map((e: { name: React.ReactNode }) => <div>{e.name}</div>)
  }
  useEffect(() => {
    if (value) {
      setV(value.name)
      //onChange && onChange(value as any)
    }
  }, [value])

  const onSearch = (t: string) => {
    Search(t, (_: any, res: any) => {
      setRes(res.tips.filter((e: { location: string | any[] }) => e.location?.length > 0))
    })
  };


  return <AutoComplete
    placeholder={placeholder}
    onSearch={onSearch}
    onChange={e => setV(e)}
    onSelect={(v: string) => {
      const obj = res.find((e: { id: string }) => e.id == v)
      setV(obj.name)
      return onChange && onChange(obj)
    }}
    value={innervalue}
  >
    {res?.map((e: any) => (< AutoComplete.Option key={e.id ?? "hi"} value={e.id}>{e.name}</AutoComplete.Option>))}
  </AutoComplete>
}

export const strtoll: (st: string) => LngLatPos = (st: string) => {
  const a = st?.split(',') ?? ""
  return {
    lng: parseFloat(a[0]) ?? 0,
    lat: parseFloat(a[1]) ?? 0
  }
}
interface IV {
  node?: any
  edge?: any
}
const QuarterElement = ({ onChange, pos, initValue }: IElementProps) => {
  const itemGrid = { span: 12 }
  const gutterValue: { gutter: [number, number] } = { gutter: [8, 8] }
  const formItemSty = { margin: "0" }
  const map = useTypedSelector(e => e.PAGlobalReducer.__map__)
  const amap = useTypedSelector(e => e.PAGlobalReducer.amap)
  const dispatch = useDispatch()
  const [form] = useForm<IForm>()
  const [iv, setIV] = useState<IV | undefined>(undefined)
  interface IForm {
    location: Tip
  }
  /*如果有initvalue,根据initvalue设置表单的值*/
  useEffect(() => {
    if (initValue?.nodes && form) {
      const t = {
        ...initValue.nodes,
        time: moment(initValue.nodes.time),
      }
      form.setFieldsValue(t)
    }
  }, [initValue, form])
  /*添加组件时移动map并且发送ActAddPauses动作,修改iv的值为当前表单*/
  const onValuesChange = (cv: IForm, v: any) => {
    if (cv.location) {
      const loc = strtoll(cv.location.location)
      try {
        map?.setCenter(new amap.LngLat(loc.lng, loc.lat))
      } catch (e) {
        console.log(e)
      }
      dispatch(ActAddPauses(pos?.idx ?? 0, { name: cv.location.name, lnglat: loc }))
    }
    setIV((e) => ({
      ...e,
      node: form.getFieldsValue(),
    }))
  }
  useEffect(() => {
    onChange && onChange(iv, form.getFieldsError())
  }, [iv])

  return (
    <>
      <div className={sty.QuaFormRoot}>
        <div className={sty.Guide} >
          <div className={sty.Dot} />
          {pos?.last ? "" : <div className={sty.LineDown} />}
          {pos?.first ? "" : <div className={sty.LineUp} />}
        </div>
        <Form onValuesChange={onValuesChange} form={form}>
          <Row {...gutterValue} >
            <Col {...itemGrid}>
              <FormItem name={"time"} style={formItemSty} rules={[{ required: true }]}>
                <DatePicker showTime placeholder={"输入日期"} />
              </FormItem>
            </Col>
            <Col {...itemGrid}>
              <FormItem name={"location"} style={{ margin: "0" }} rules={[{ required: true }]}>
                <SearchInput placeholder={"搜索地点"} />
              </FormItem>
            </Col>
          </Row>
          <Row {...gutterValue}>
            <Col {...itemGrid}>
              <FormItem name={"contacts"} style={{ margin: "0" }}>
                <Input placeholder={"可能密接者"} />
              </FormItem>
            </Col>
            <Col {...itemGrid}>
              <FormItem name={"detail"} style={{ margin: "0" }}>
                <Input placeholder={"备注"} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      {
        pos?.last ? null :
          <ConjectionElement
            onChange={(v: any) => setIV(e => ({ ...e, edge: v }))}
            initValue={initValue}
            pos={pos}
          />

      }
    </>
  )
}
interface IProps {
  onSubmit: (value: any) => void
}

interface Context {
  type: "qua" | "con"
  onChange?: (v?: IV, e?: any) => void
  form?: FormInstance
  initValue?: any
}
export default function PathForm({ onChange }: { onChange?: (v: IV, form?: FormInstance) => void }) {
  const [elements, setElements] = useState<Context[]>([])
  const dispatch = useDispatch()
  const loaded_form = useTypedSelector(e => e.PAGlobalReducer.loaded_form)
  const [form] = useForm<{
    [key: number]: IV
  }>()
  /*渲染一个驻留表单*/ 
  const renderContext: (e: Context, idx: number) => JSX.Element = (e, idx) => {
    return (
      <FormItem noStyle={true} name={idx} rules={[{ required: true }]}>
        <QuarterElement
          {...e}
          pos={{
            idx: idx,
            first: idx == 0,
            last: idx == elements.length - 1
          }}
          initValue={e.initValue}
        />
      </FormItem>
    )
  }
  /*第一个路径点*/
  useEffect(() => {
    if (elements.length == 0)
      onAdd()
  }, [])
  /*添加一个驻留点表单*/
  const onAdd = () => {
    const values = form.getFieldsValue()
    if (elements.length > 0 && !values[elements.length - 1]?.node?.location) {
      /*todo 此处可以设置将其内容清空*/
      message.warning("请填写行程信息")
      return
    }
    if (elements.length > 0 && !values[elements.length - 1]?.node?.time) {
      message.warning("请填写时间信息")
      return
    }

    setElements((ele) =>
      produce(ele, (draft) => {
        draft.push({
          type: "con",
        })
      })
    )
  }
  /*如果loadedform值不为空，使用loadedform的值初始化*/
  const init_pathform = (v: BaseItem) => {
    const vv = v.path.nodes.map((e, idx) => ({
      nodes: e,
      edges: v.path.edges[idx]
    }))

    setElements(v.path.nodes.map((e, idx) => ({
      type: "con",
      initValue: vv[idx]
    })))
  }
  useEffect(() => {
    if (loaded_form)
      init_pathform(loaded_form)
  }, [loaded_form])

  const onFormValuesChange = (cv: any, v: any) => {
    onChange && onChange(v, form)
  }
  /*删除一个驻留点，如果最顶端的location已经设置，发出ActRemovePauses*/
  const onDel = () => {
    setElements((ele) => produce(ele, d => {
      if (d.length == 1)
        return
      const values = form.getFieldsValue()
      if (elements.length > 0 && values[elements.length - 1]?.node?.location) {
        dispatch(ActRemovePauses())
      }
      d.pop()
    })
    )
  }
  return (
    <>
      <Col className={sty.Root}>
        {
          <Form form={form} onValuesChange={onFormValuesChange}>
            {elements.map(renderContext)}
          </Form>
        }
        <div className={sty.ButtonBox}>
          <Button onClick={() => onAdd()} icon={<PlusCircleOutlined />}>新增</Button>
          <Button onClick={() => onDel()} icon={<DeleteOutlined />} danger disabled={elements.length == 1}>减少</Button>
        </div>
      </Col >
    </>
  )
}
