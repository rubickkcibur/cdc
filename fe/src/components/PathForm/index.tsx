import { Button, Col, Input, Row, Select } from "antd"
import Form, { FormInstance, useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import produce from "immer"
import React, { useCallback, useState } from "react"
import sty from "./index.module.scss"

const ConjectionElement = ({ onChange }: any) => {
  const itemGrid = { span: 12 }
  const gutterValue = { gutter: 12 }
  const [form] = useForm()
  const onValuesChange = (cv: any, v: any) => {
    onChange && onChange(form.getFieldsValue())
  }

  return (
    <div className={sty.DouFormRoot}>
      <div className={sty.Guide} />
      <Form onValuesChange={onValuesChange} form={form}>
        <Row {...gutterValue}>
          <Col {...itemGrid}>
            <FormItem name={"traffic"}>
              <Select />
            </FormItem>
          </Col>
          <Col {...itemGrid}>
            <FormItem name={"description"}>
              <Input />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
const QuarterElement = ({ onChange }: any) => {
  const itemGrid = { span: 12 }
  const gutterValue = { gutter: 12 }
  const [form] = useForm()
  const onValuesChange = (cv: any, v: any) => {
    onChange && onChange(form.getFieldsValue())
  }

  return (
    <div className={sty.QuaFormRoot}>
      <div className={sty.Guide} />
      <Form onValuesChange={onValuesChange} form={form}>
        <Row {...gutterValue}>
          <Col {...itemGrid}>
            <FormItem name={"date"}>
              <Input />
            </FormItem>
          </Col>
          <Col {...itemGrid}>
            <FormItem name={"location"}>
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row {...gutterValue}>
          <Col {...itemGrid}>
            <FormItem name={"people"}>
              <Input />
            </FormItem>
          </Col>
          <Col {...itemGrid}>
            <FormItem name={"record"}>
              <Input />
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
  const renderContext: (e: Context) => JSX.Element = (e) => {
    const Ele = e.type === "qua" ? QuarterElement : ConjectionElement
    return <Ele {...e} />
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
                  d[idx] = vv
                })
              )
            },
          })
        draft.push({
          type: "qua",
          onChange() {},
        })
      })
    )
  }, [])
  return (
    <div>
      {elements.map(renderContext)}
      <Button onClick={() => onAdd()}>Add</Button>
    </div>
  )
}
