import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Col, DatePicker, Input, Row, Select } from "antd"
import Form, { FormInstance, useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import produce from "immer"
import React, { useCallback, useState } from "react"
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
  }
  onChange: (v: FormInstance) => any
}

const QuarterElement = ({ onChange, pos }: IElementProps) => {
  const itemGrid = { span: 12 }
  const gutterValue: { gutter: [number, number] } = { gutter: [8, 8] }
  const formItemSty = { margin: "0" }
  const [form] = useForm()
  const onValuesChange = (cv: any, v: any) => {
    onChange && onChange(form.getFieldsValue())
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
              <Input placeholder={"搜索地点"} />
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
      first: idx == 0,
      last: idx == elements.length - 1
    }} />
  }
  const [values, setValues] = useState<any[]>()
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
        d.pop()
        if (d.length > 1)
          d.pop()



      })
      )
    },
    [],
  )
  return (
    <div>
      {elements.map(renderContext)}
      <div className={sty.ButtonBox}>
        <Button onClick={() => onAdd()} icon={<PlusCircleOutlined />}>新增</Button>
        <Button onClick={() => onDel()} icon={<DeleteOutlined />} danger>减少</Button>
      </div>
    </div>
  )
}
