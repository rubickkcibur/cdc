import React, { useState } from "react";
import { Button, Dropdown, Menu, message, Switch, Tabs } from "antd"
import { DownOutlined, ReadOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons"
import { useTypedSelector } from "../../lib/store";

export default function EpidChoose({size,change}:{size:string,change:(e:any)=>void}){
    const [epidemic, setE] = useState<string>("待选择")
    const epidemics=useTypedSelector(e => e.PAGlobalReducer.epidemics);
    const menuClick = (e:any) => {
        setE(epidemics?epidemics[e.key].name:"待选择")
        change(e.key)
      }
    
    const menu = (
        <Menu onClick={menuClick}>
          {epidemics?.map(
            (e:any,idx:any)=>(
              <Menu.Item key={idx}>
                {e.name}
              </Menu.Item>
            )
          )}
        </Menu>
    )
    return(
        <Dropdown overlay={menu} trigger={['click']}>
            {
                size=="large"?
                <h1>{epidemic}<DownOutlined/></h1>:
                size == "middle"?
                <h2>{epidemic}<DownOutlined/></h2>:
                size == "small"?
                <h4>{epidemic}<DownOutlined/></h4>:
                <h5>{epidemic}<DownOutlined/></h5>
            }
        </Dropdown>
    )
}