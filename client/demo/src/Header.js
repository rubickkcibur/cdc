import Icon from '@ant-design/icons/lib/components/Icon';
import {Row, Col} from 'antd';
import React from 'react';
import "./Header.css";
import {SearchOutlined} from "@ant-design/icons";
// import {users} from "./images/users.svg";



class Head extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current:"report"
        }
    }

    render(){
        return (
            <Row id="menu-bar">
                <Col span={5} id = "title">疫情流调系统</Col>
                <Col span={4} ><a href="/report"><img src={"chart-bar.svg"} /> <span id="t1">流调填报</span></a></Col>
                <Col span={4} ><a href="/overview"><img src={"users.svg"} /> <span id="t1">流调总览</span></a></Col>
                <Col span={5}></Col>
                <Col span={3}></Col>
                <Col span={1}><img src={"search.svg"} /></Col>
                <Col span={2}><img src={"avator.png"} /> <span id="t2">用户名</span></Col>
            </Row>
            
        )
    }
    
}

export default Head;

