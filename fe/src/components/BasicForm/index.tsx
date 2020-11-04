import { Cascader, Select } from "antd"
import Form, { useForm } from "antd/lib/form/Form"
import FormItem from "antd/lib/form/FormItem"
import { Col } from "antd/lib/grid"
import Row from "antd/lib/grid/row"
import Input from "antd/lib/input/Input"
import React from "react"

interface IProps {
  onChange?: (value: any) => void
}
export default function FormBasic({ onChange }: IProps) {
  const fullItemGrid = { md: { span: 24 } }
  const halfItemGrid = { md: { span: 12 } }
  const halfGutter: [number, number] = [32, 15]
  const [form] = useForm()

  const onValueChange = (changed: any, values: any) => {
    onChange && onChange(values)
  }

  return (
    <Form onValuesChange={onValueChange} form={form}>
      <Row gutter={halfGutter}>
        <Col {...halfItemGrid}>
          <FormItem label={"姓名"} name={"name"}>
            <Input placeholder={"请输入姓名"} />
          </FormItem>
        </Col>
        <Col {...halfItemGrid}>
          <FormItem label={"性别"} name={"gender"} initialValue={"male"}>
            <Select>
              <Select.Option value={"male"}> 男</Select.Option>
              <Select.Option value={"female"}>女</Select.Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={halfGutter}>
        <Col {...halfItemGrid}>
          <FormItem label={"电话"} name={"phone"}>
            <Input placeholder={"请输入电话"} />
          </FormItem>
        </Col>
        <Col {...halfItemGrid}>
          <FormItem label={"年龄"} name={"age"}>
            <Input placeholder={"请输入年龄"} />
          </FormItem>
        </Col>
      </Row>

      <Col {...fullItemGrid}>
        <FormItem label={"住址"} name={"addr1"}>
          <Cascader placeholder={"省/市/区"} />
        </FormItem>
      </Col>

      <Col {...fullItemGrid}>
        <FormItem label={""} colon={false} name={"addr2"}>
          <Input placeholder={"县/街道"} />
        </FormItem>
      </Col>
    </Form>
  )
}
