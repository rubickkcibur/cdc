import { Button } from "antd"
import { Col, Row } from "antd/lib/grid"
import Tabs from "antd/lib/tabs"
import React from "react"
import BasicQues from "../../components/BasicQues"
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from "./index.module.scss"
export default function Question(){
    const { TabPane } = Tabs;
    return(
        <MainLayout>
            <Row gutter={[14, 14]} style={{ display: "flex", alignItems: "stretch",height:'initial' }} className={sty.RootRow}>
                <Col span={4}/>
                <Col span={16} className={sty.BasicPanel}>
                    <Tabs tabPosition="left">
                        <TabPane tab="基本版" key="1">
                            <BasicQues/>
                        </TabPane>
                        <TabPane tab="北京版" key="2">
                            <BasicQues/>
                        </TabPane>
                        <TabPane tab="黑龙江版" key="3">
                            <BasicQues/>
                        </TabPane>
                        <TabPane tab="河北版" key="4">
                            <BasicQues/>
                        </TabPane>
                    </Tabs>
                </Col>
                <Col span={4}>
                    <Button className={sty.Save} >保存</Button>
                </Col>
            </Row>
        </MainLayout>
    )
}