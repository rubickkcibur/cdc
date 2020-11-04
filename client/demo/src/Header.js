import {Menu} from 'antd';
import React from 'react';
import "./Header.css";
import image from "../public/users.svg"
class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current:"report"
        }
    }

    render(){
        return (
            <div>
            <Menu mode="horizontal" theme="dark">

                <Menu.Item key="title">疫情流调系统</Menu.Item>
                <Menu.Item key="report" ><a href="/report">流调填报</a></Menu.Item>
                <Menu.Item key="overview" ><a href="/overview">流调总览</a></Menu.Item>
                <Menu.Item key="search" icon={image}></Menu.Item>

                
                
            </Menu>
            </div>
        )
    }
    
}

export default Header;

