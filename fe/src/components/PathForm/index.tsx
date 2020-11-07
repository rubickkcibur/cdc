import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { AutoComplete, Button, Col, DatePicker, Input, message, Row, Select } from "antd"
import Form, { FormInstance, useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import produce from "immer"
import { type } from "os"
import React, { useCallback, useEffect, useState } from "react"
import { LngLatPos } from "react-amap"
import { useDispatch } from "react-redux"
import { dispatch } from "rxjs/internal/observable/pairs"
import Search, { Tip } from "../../lib/search"
import { ActAddPauses, ActRemovePauses, ActUpdateValue } from "../../lib/state/global"
import { useTypedSelector } from "../../lib/store"
import sty from "./index.module.scss"
import TrafficData from './traffic.json'

interface IElementProps {

  pos?: {
    last?: boolean
    first?: boolean
    idx: number
  }
  value?: any
  onChange?: (v: any, e: any[]) => any
}


const ConjectionElement = ({ onChange }: IElementProps) => {
  const itemGrid = { span: 12 }
  const gutterValue: { gutter: [number, number] } = { gutter: [8, 8] }
  const formItemSty = { margin: "0" }
  const [form] = useForm()
  const onValuesChange = (cv: any, v: any) => {
    onChange && onChange(form.getFieldsValue(), form.getFieldsError())
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
  const [form] = useForm<IForm>()
  interface IForm {
    location: Tip
  }
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
    onChange && onChange(form.getFieldsValue(), form.getFieldsError())
  }

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

      {
        pos?.last ? null :
          <ConjectionElement
            onChange={(v: any) => onChange && onChange(form.getFieldsValue(), form.getFieldsError())}
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
  onChange?: (v: any, e: any) => void

  form?: FormInstance
}
export default function PathForm() {
  const [elements, setElements] = useState<Context[]>([])
  const dispatch = useDispatch()
  const [form] = useForm()
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
        />
      </FormItem>
    )
  }
  useEffect(() => {
    if (elements.length == 0)
      onAdd()
  }, [])
  const onAdd = () => {
    const values = form.getFieldsValue()
    if (elements.length > 0 && !values[elements.length - 1]?.location) {
      message.warning("请填写行程信息")
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
  const onFormValuesChange = (cv: any, v: any) => {
  }
  const onDel = () => {
    setElements((ele) => produce(ele, d => {
      if (d.length == 1)
        return
      const values = form.getFieldsValue()
      if (elements.length > 0 && values[elements.length - 1]?.location) {
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
