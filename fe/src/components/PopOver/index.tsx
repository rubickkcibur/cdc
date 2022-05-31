import { Popover, Button,Table } from 'antd';
import Constant from '../../lib/constant'
import React, { useEffect, useState } from 'react'
import { MinusCircleOutlined } from '@ant-design/icons';
import sty from './index.module.scss';


export default function PopOver({str}:{str:string}) {
    const [isDisable1,setDisable1]=useState<boolean>(false);
    const [button11,setButton11]=useState("通过");
    const [button21,setButton21]=useState("驳回");
    const [isDisable2,setDisable2]=useState<boolean>(false);
    const [button12,setButton12]=useState("通过");
    const [button22,setButton22]=useState("驳回");
    const [isDisable3,setDisable3]=useState<boolean>(false);
    const [button13,setButton13]=useState("通过");
    const [button23,setButton23]=useState("驳回");

    function pass1() {
        setDisable1(true);
        setButton11("已通过");
    }
    function back1() {
        setDisable1(true);
        setButton21("已驳回");
    }
    function pass2() {
        setDisable2(true);
        setButton12("已通过");
    }
    function back2() {
        setDisable2(true);
        setButton22("已驳回");
    }
    function pass3() {
        setDisable3(true);
        setButton13("已通过");
    }
    function back3() {
        setDisable3(true);
        setButton23("已驳回");
    }

    const columns = [
        {
            title: '版本',
            dataIndex: 'version',
            key: 'version',
            render:(text:any)=>(
                <a href={`${Constant.apihost}/downloadDocx`}>{text}</a>
            )
        },
        {
            title: '负责人',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            dataIndex: 'status',
            key:'status',
            render: (text:any, record:any) => (
                <div>
                    <span>
                        <Button type="primary" disabled={record.status.disable1} onClick={record.status.pass}>{record.status.words1}</Button>
                    </span>
                    <span style={{marginLeft:'5px'}}>
                        <Button type="primary" disabled={record.status.disable1} danger onClick={record.status.back0}>{record.status.words2}</Button>
                    </span>
                </div>
            ),
        },
    ];
    const data = [
        {
            key: '1',
            version: '版本1',
            name: '张三',
            status:{
                disable1:isDisable1,
                words1:button11,
                words2:button21,
                pass:pass1,
                back0:back1,
            },
        },
        {
            key: '2',
            version: '版本2',
            name: '李四',
            status:{
                disable1:isDisable2,
                words1:button12,
                words2:button22,
                pass:pass2,
                back0:back2,
            },
        },
        {
            key: '3',
            version: '版本3',
            name: '刘五',
            status:{
                disable1:isDisable3,
                words1:button13,
                words2:button23,
                pass:pass3,
                back0:back3,
            },
        },
    ];
    const content = (
        <div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
    return(
        <div>
            <Popover content={content} title="版本变更表" trigger="click">
                <span style={{fontSize:"18px"}}><a>{str}</a></span>
            </Popover>
        </div>
    )
}