import React, { useState } from "react";
import { Button, Dropdown, Menu, message, Switch, Tabs } from "antd"
import { DownOutlined, ReadOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons"

export default function EpidChoose({size}:{size:string}){
    const [epidemic, setE] = useState<string>("待选择")
    const menuClick = (e:any) => {
        if (e.key == "0"){
          setE("待选择")
          console.log("待选择")
        }
        if (e.key == "1"){
          setE("北京新发地疫情")
          console.log("北京新发地疫情")
        }
        if (e.key == "2"){
          setE("北京大兴疫情")
          console.log("北京大兴疫情")
        }
        if (e.key == "3"){
          setE("河北石家庄疫情")
          console.log("河北石家庄疫情")
        }
        if (e.key == "4"){
          setE("北京顺义疫情")
          console.log("北京顺义疫情")
        }
      }
    
    const menu = (
        <Menu onClick={menuClick}>
          <Menu.Item key="0">
            待选择
          </Menu.Item>
          <Menu.Item key="1">
            北京新发地疫情
          </Menu.Item>
          <Menu.Item key="2">
            北京大兴疫情
          </Menu.Item>
          <Menu.Item key="3">
            河北石家庄疫情
          </Menu.Item>
          <Menu.Item key="4">
            北京顺义疫情
          </Menu.Item>
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