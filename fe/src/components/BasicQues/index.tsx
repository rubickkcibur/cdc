import React, { useEffect, useState } from "react"
import Col, { ColProps } from "antd/lib/grid/col"
import Row from "antd/lib/grid/row"
import { Button, Checkbox, DatePicker, Divider, Form, Input, Radio, Select } from "antd"
import FormItem from "antd/lib/form/FormItem"
import { useForm } from "antd/lib/form/Form"
import NewLabel from "../NewLabel"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
export default function BasicQues(){
    const { Option } = Select;
    const [bingfa,setBF] = useState<boolean>(false)
    const [xiong,setX] =useState<number>(1)
    const [yun,setY] = useState<boolean>(false)
    const [yan,setYan] = useState<number>(1)
    const [shequ,setSQ] = useState<number>(1)
    const [guojia,setGJ] = useState<number>(1)
    const [jingneihuanzhe,setJNHZ] = useState<number>(1)
    const [jingwaihuanzhe,setJWHZ] = useState<number>(1)
    const [jiechushi,setJCS] = useState<number>(1)
    const [juji,setJJ] = useState<number>(1)
    const [biaoben,setBB] = useState<number>(1)
    const halfGutter: [number, number] = [32, 15];
    return(
        <>
            <Form style={{overflowX:'hidden',overflowY:'auto'}}>
                <Divider style={{ borderWidth: 2, borderColor: '#1890ff' }} >发病与就诊情况</Divider>
                <FormItem label="病例发现途径">
                    <Select>
                        <Option value="主动就诊">主动就诊</Option>
                        <Option value="密接管理发现">密接管理发现</Option>
                        <Option value="入境筛查">入境筛查</Option>
                        <Option value="人群主动筛查">人群主动筛查</Option>
                        <Option value="不明原因肺炎、SARS等常规检测发现">不明原因肺炎、SARS等常规检测发现</Option>
                        <Option value="其他">其他</Option>
                    </Select>
                </FormItem>
                <FormItem label="入院日期">
                    <DatePicker/>
                </FormItem>
                <FormItem label="入院时症状和体征">
                    <Checkbox.Group options={['发热','寒战','干咳','咳痰','鼻塞']}/>
                    <br/>
                    <Checkbox.Group options={['流涕','咽痛','头痛','乏力','头晕']}/>
                    <br/>
                    <Checkbox.Group options={['肌肉酸痛','关节酸痛','气促','呼吸困难','胸闷']}/>
                    <br/>
                    <Checkbox.Group options={['胸痛','结膜充血','恶心','呕吐','腹泻']}/>
                    <br/>
                    <Checkbox.Group options={['腹痛','肺炎','其他']}/>
                </FormItem>
                <FormItem label="有无并发症">
                    <Radio.Group onChange={e=>setBF(e.target.value)} value={bingfa}>
                        <Radio value={false}>无</Radio>
                        <Radio value={true}>有</Radio>
                    </Radio.Group>
                </FormItem>
                {
                    bingfa?
                    <FormItem label="并发症">
                        <Checkbox.Group options={['肺炎','脑炎','脑膜炎','菌血症','心肌炎']}></Checkbox.Group>
                    </FormItem>
                    :null
                }
                <FormItem label="胸部Ｘ线或CT检测是否有新冠肺炎影像学特征"> 
                    <Radio.Group onChange={e=>setX(e.target.value)} value={xiong}>
                        <Radio value={1}>未检测</Radio>
                        <Radio value={2}>无</Radio>
                        <Radio value={3}>有</Radio>
                    </Radio.Group>
                </FormItem>
                {
                    xiong == 3 ?
                    <FormItem label="检查时间">
                        <DatePicker/>
                    </FormItem>:null
                }
                <Divider style={{ borderWidth: 2, borderColor: '#1890ff' }} >危险因素与暴露史情况</Divider>
                <FormItem label="是否为孕妇"> 
                    <Radio.Group onChange={e=>setY(e.target.value)} value={yun}>
                        <Radio value={false}>否</Radio>
                        <Radio value={true}>是</Radio>
                    </Radio.Group>
                </FormItem>
                {
                    yun?
                    <FormItem label="孕周"> 
                        <Input/>
                    </FormItem>:null
                }
                <FormItem label="是否吸烟"> 
                    <Radio.Group onChange={e=>setYan(e.target.value)} value={yan}>
                        <Radio value={1}>经常吸（每天吸卷烟一直以上，连续或累计6个月）</Radio>
                        <Radio value={2}>偶尔吸（每周吸卷烟四支以上，但平均每天不足一支）</Radio>
                        <Radio value={3}>从不吸烟</Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem label="14天内是否到过境内有确诊病例或无症状感染者的社区"> 
                    <Radio.Group onChange={e=>setSQ(e.target.value)} value={shequ}>
                        <Radio value={1}>旅行史</Radio>
                        <Radio value={2}>居住史</Radio>
                        <Radio value={3}>否</Radio>
                    </Radio.Group>
                </FormItem>
                {
                    shequ!=3?
                    <FormItem label="社区名称"> 
                        <Input/>
                    </FormItem>:null
                }
                <FormItem label="14天内是否有境外疫情国家和地区的旅行史或居住史"> 
                    <Radio.Group onChange={e=>setGJ(e.target.value)} value={guojia}>
                        <Radio value={1}>旅行史</Radio>
                        <Radio value={2}>居住史</Radio>
                        <Radio value={3}>否</Radio>
                    </Radio.Group>
                </FormItem>
                {
                    guojia!=3?
                    <FormItem label="国家或地区名称"> 
                        <Input/>
                    </FormItem>:null
                }
                <FormItem label="14天内是否接触过境内有确诊病例或无症状感染者报告社区的发热和/或呼吸道症状的患者"> 
                    <Radio.Group onChange={e=>setJNHZ(e.target.value)} value={jingneihuanzhe}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                        <Radio value={3}>不清楚</Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem label="14天内是否接触过来自境外有疫情国家和地区的发热和/或呼吸道症状患者"> 
                    <Radio.Group onChange={e=>setJWHZ(e.target.value)} value={jingwaihuanzhe}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                        <Radio value={3}>不清楚</Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem label="14天内是否曾有确诊病例或无症状感染者的接触史"> 
                    <Radio.Group onChange={e=>setJCS(e.target.value)} value={jiechushi}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                        <Radio value={3}>不清楚</Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem label="14天内患者同一家庭、办公室、学校或托幼机构班级、车间等集体单位是否有聚集性发病"> 
                    <Radio.Group onChange={e=>setJJ(e.target.value)} value={juji}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                        <Radio value={3}>不清楚</Radio>
                    </Radio.Group>
                </FormItem>
                <Divider style={{ borderWidth: 2, borderColor: '#1890ff' }} >密接情况</Divider>
                <Form.List name="密接信息">
                    {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                key={field.key}
                            >
                                <Row>
                                    <Col span={5}>
                                        <FormItem label="密接者姓名">
                                            <Input/>
                                        </FormItem>
                                    </Col>
                                    <Col span={5}>
                                        <FormItem label="身份证号">
                                            <Input/>
                                        </FormItem>
                                    </Col>
                                    <Col span={5}>
                                        <FormItem label="性别">
                                            <Input/>
                                        </FormItem>
                                    </Col>
                                    <Col span={9}>
                                        <FormItem label="手机">
                                            <Input/>
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="基础性疾病">
                                            <Select>
                                                <Option value="心脑血管疾病">心脑血管疾病</Option>
                                                <Option value="高血压">高血压</Option>
                                                <Option value="糖尿病">糖尿病</Option>
                                                <Option value="哮喘">哮喘</Option>
                                                <Option value="慢性阻塞性肺部疾病">慢性阻塞性肺部疾病</Option>
                                                <Option value="肺癌">肺癌</Option>
                                                <Option value="慢性肾病">慢性肾病</Option>
                                                <Option value="慢性肝病">慢性肝病</Option>
                                                <Option value="免疫缺陷类疾病">免疫缺陷类疾病</Option>
                                                <Option value="产后（6周内）">产后（6周内）</Option>
                                                <Option value="无">无</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="与病例关系">
                                            <Select>
                                                <Option value="父母">父母</Option>
                                                <Option value="配偶">配偶</Option>
                                                <Option value="其他亲戚">其他亲戚</Option>
                                                <Option value="同事">同事</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="接触方式">
                                            <Select>
                                                <Option value="共同居住生活">共同居住生活</Option>
                                                <Option value="医疗护理">医疗护理</Option>
                                                <Option value="聚餐">聚餐</Option>
                                                <Option value="日常交谈">日常交谈</Option>
                                                <Option value="同乘交通工具">同乘交通工具</Option>
                                                <Option value="仅共处同一密闭空间，无直接接触与交流">仅共处同一密闭空间，无直接接触与交流</Option>
                                                <Option value="其他">其他</Option>
                                            </Select>
                                        </FormItem>、
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={4}>
                                        {fields.length >= 1 ? (
                                        <Button
                                            onClick={() => remove(field.name)}
                                            danger
                                        >删除</Button>
                                        ) : null}
                                    </Col>
                                </Row>
                            </Form.Item>
                        ))}
                        <Form.Item label="密接者信息">
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                style={{ width: '60%' }}
                                icon={<PlusOutlined />}
                            >
                                添加密接信息
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                    )}
                </Form.List>
                <Divider style={{ borderWidth: 2, borderColor: '#1890ff' }} >实验室检测情况</Divider>
                <FormItem label="检测标本类型"> 
                    <Radio.Group onChange={e=>setBB(e.target.value)} value={biaoben}>
                        <Radio value={1}>咽拭子</Radio>
                        <Radio value={2}>鼻拭子</Radio>
                        <Radio value={3}>其他</Radio>
                    </Radio.Group>
                </FormItem>
                {
                    biaoben == 3?
                    <FormItem label="其他时输入"> 
                        <Input/>
                    </FormItem>:null
                }
                <FormItem label="采样时间"> 
                    <DatePicker/>
                </FormItem>
                <FormItem label="检测结果"> 
                    <Select>
                        <Option value="阴性">阴性</Option>
                        <Option value="阳性">阳性</Option>
                    </Select>
                </FormItem>
            </Form>
            <Divider style={{ borderWidth: 2, borderColor: '#1890ff' }} >自定义模板</Divider>
            <NewLabel/>
        </>
    )
}