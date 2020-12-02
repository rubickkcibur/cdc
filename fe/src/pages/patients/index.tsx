import { Card, Descriptions, Select } from "antd";
import DescriptionsItem from "antd/lib/descriptions/Item";
import React, { useEffect, useState } from "react";
import DebouncedAutocomplete from "../../components/AutoComplete";
import MainLayout from "../../components/MainLayoout/PageLayout"
import { useTypedSelector } from "../../lib/store";
import sty from './index.module.scss'
import { Node } from '../../lib/types/types'

const asd:React.ReactNode=<p>hhh</p>

export default function Pagepatients() {
    const [pid, setPid] = useState<string>("3");
    const loaded_form = useTypedSelector(e => e.PAGlobalReducer.loaded_form);
    console.log(loaded_form?.basic.personal_id);

    const renderPauseCard:(pau:Node) => JSX.Element = (pau)=>{
      return (
        <Card title={pau.location.name}>
          <p>抵达时间: {pau.time}</p>
          <p>经纬度: {pau.location.location}</p>
          <p>行政区: {pau.location.district}</p>
          <p>详细地址: {pau.location.address}</p>
        </Card>
      )
    }

    return <MainLayout>
    <div>
      <Descriptions title="患者信息" bordered>
        <Descriptions.Item label="姓名">
          {loaded_form?.basic.name}
        </Descriptions.Item>
        <Descriptions.Item label="性别">
          {loaded_form?.basic.gender}
        </Descriptions.Item>
        <Descriptions.Item label="年龄">
          {loaded_form?.basic.age}
        </Descriptions.Item>
        <Descriptions.Item label="身份证号" span={1.5}>
          {loaded_form?.basic.personal_id}
        </Descriptions.Item>
        <Descriptions.Item label="手机号码" span={1.5}>
          {loaded_form?.basic.phone}
        </Descriptions.Item>
        <Descriptions.Item label="地址" span={3}>
          {loaded_form?.basic.addr1[0]}&nbsp; 
          {loaded_form?.basic.addr1[0]}&nbsp;
          {loaded_form?.basic.addr1[0]}&nbsp;
          {loaded_form?.basic.addr2}
        </Descriptions.Item>
      </Descriptions>
    </div>
    <div>
      {loaded_form?.path.nodes.map(renderPauseCard)}
    </div>
  </MainLayout>
    
}