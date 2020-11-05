import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { AutoComplete, Button, Col, DatePicker, Input, Row, Select } from "antd"
import Form, { FormInstance, useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import produce from "immer"
import React, { useCallback, useEffect, useState } from "react"
import { LngLatPos } from "react-amap"
import { useDispatch } from "react-redux"
import { dispatch } from "rxjs/internal/observable/pairs"
import Search, { Tip } from "../../lib/search"
import { ActAddPauses, ActRemovePauses } from "../../lib/state/global"
import { useTypedSelector } from "../../lib/store"
import sty from "./index.module.scss"
import TrafficData from './traffic.json'



const ConjectionElement = ({ onChange }: any) => {
  const itemGrid = { span: 12 }
  const gutterValue: { gutter: [number, number] } = { gutter: [8, 8] }
  const formItemSty = { margin: "0" }
  const [form] = useForm()
  const onValuesChange = (cv: any, v: any) => {
    onChange && onChange(form.getFieldsValue())
  }

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
interface IElementProps {

  pos?: {
    last?: boolean
    first?: boolean
    idx: number
  }
  onChange: (v: FormInstance) => any
}

interface InputIProps { value?: any, onChange?: (v: string) => void, placeholder: string }

const SearchInput = ({ onChange, placeholder }: InputIProps) => {
  const [res, setRes] = useState<any>(undefined)
  const [innervalue, setV] = useState<string>("")
  function renderItems(data: any) {
    return data?.map((e: { name: React.ReactNode }) => <div>{e.name}</div>)
  }

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
    {res?.map((e: any) => (<AutoComplete.Option key={e.id ?? "hi"} value={e.id}>{e.name}</AutoComplete.Option>))}
  </AutoComplete>
}

const strtoll: (st: string) => LngLatPos = (st: string) => {
  const a = st?.split(',') ?? ""
  return {
    lng: parseFloat(a[0]) ?? 0,
    lat: parseFloat(a[1]) ?? 0
  }



}
const QuarterElement = ({ onChange, pos }: IElementProps) => {
  const itemGrid = { span: 12 }
  const gutterValue: { gutter: [number, number] } = { gutter: [8, 8] }
  const formItemSty = { margin: "0" }
  const map = useTypedSelector(e => e.PAGlobalReducer.__map__)
  const amap = useTypedSelector(e => e.PAGlobalReducer.amap)
  const dispatch = useDispatch()
  interface IForm {

    location: Tip
  }
  const [form] = useForm<IForm>()
  const onValuesChange = (cv: IForm, v: any) => {
    onChange && onChange(form)
    if (cv.location) {
      const loc = strtoll(cv.location.location)
      console.log(123, loc)
      try {
        map?.setCenter(new amap.LngLat(loc.lng, loc.lat))
      } catch (e) {
        console.log(e)
      }
      dispatch(ActAddPauses(pos?.idx ?? 0, { name: cv.location.name, lnglat: loc }))
    }
  }

  return (
    <div className={sty.QuaFormRoot}>
      <div className={sty.Guide} >
        <div className={sty.Dot} />
        {pos?.last ? "" : <div className={sty.LineDown} />}
        {pos?.first ? "" : <div className={sty.LineUp} />}
      </div>
      <Form onValuesChange={onValuesChange} form={form}>
        <Row {...gutterValue} >
          <Col {...itemGrid}>
            <FormItem name={"date"} style={formItemSty}>
              <DatePicker showTime placeholder={"输入日期"} />
            </FormItem>
          </Col>
          <Col {...itemGrid}>
            <FormItem name={"location"} style={{ margin: "0" }}>
              <SearchInput placeholder={"搜索地点"} />
            </FormItem>
          </Col>
        </Row>
        <Row {...gutterValue}>
          <Col {...itemGrid}>
            <FormItem name={"people"} style={{ margin: "0" }}>
              <Input placeholder={"可能密接者"} />
            </FormItem>
          </Col>
          <Col {...itemGrid}>
            <FormItem name={"record"} style={{ margin: "0" }}>
              <Input placeholder={"备注"} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
interface IProps {
  onSubmit: (value: any) => void
}

interface Context {
  type: "qua" | "con"
  onChange: (values: any) => void
}
export default function PathForm() {
  const [elements, setElements] = useState<Context[]>([])
  const renderContext: (e: Context, idx: number) => JSX.Element = (e, idx) => {
    const Ele = e.type === "qua" ? QuarterElement : ConjectionElement
    return <Ele {...e} pos={{
      idx: idx,
      first: idx == 0,
      last: idx == elements.length - 1
    }} />
  }
  const [values, setValues] = useState<any[]>()
  const dispatch = useDispatch()
  useEffect(() => {
    onAdd()
  }, [])
  const onAdd = useCallback(() => {
    setElements((ele) =>
      produce(ele, (draft) => {
        const idx = ele.length

        idx != 0 &&
          draft.push({
            type: "con",
            onChange(vv) {
              setValues((v) =>
                produce(v, (d) => {
                  // d[idx] = vv
                })
              )
            },
          })
        draft.push({
          type: "qua",
          onChange() { },
        })
      })
    )
  }, [])
  const onDel = useCallback(
    () => {
      setElements((ele) => produce(ele, d => {
        if (d.length == 1)
          return
        dispatch(ActRemovePauses())
        d.pop()
        if (d.length > 1)
          d.pop()
      })
      )
    },
    [],
  )
  return (
    <>
      <Col className={sty.Root}>
        {elements.map(renderContext)}
        <div className={sty.ButtonBox}>
          <Button onClick={() => onAdd()} icon={<PlusCircleOutlined />}>新增</Button>
          <Button onClick={() => onDel()} icon={<DeleteOutlined />} danger disabled={elements.length == 1}>减少</Button>
        </div>
      </Col >
    </>
  )
}
