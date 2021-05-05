import {Popover, Button, Table, Row, Col, Input, Tooltip} from 'antd';
import React, { useEffect, useState } from 'react'
import { PlusOutlined,CloseOutlined } from '@ant-design/icons';
import sty from './index.module.scss';

export interface Labels { name: string, context: string }

export default function NewLabel() {
    const [labels,setLabels]=useState<Labels[]>([]);
    const [input,setInput]=useState("");
    const [aI,setAI]=useState(sty.addIcon);
    const [aInput,setAInput]=useState(sty.hidden);
    const [input1,setInput1]=useState<string[]>([]);

    const inputConfirm = () => {
        let a=labels;
        a.push({
            name:input,
            context:""
        });
        setAI(sty.addIcon);
        setAInput(sty.hidden);
        setInput("")
    };
    function changeInput(k:any,index:number) {
        let a=labels;
        a[index].context=k.target.value;
        setLabels(a);
        let b=input1;
        b[index]=k.target.value;
        setInput1(b);
    }
    function addLabel() {
        setAI(sty.hidden);
        setAInput(sty.addInput);
    }

    return(
        <div>
            {
                labels?.map((e, idx) => {
                    return (
                        <div style={{marginTop:'12px'}}>
                            <Input addonBefore={e.name} addonAfter={
                                <Tooltip title="删除该输入框">
                                    <Button size="small"
                                            onClick={() => {
                                                let tmp = labels.slice();
                                                tmp.splice(idx, 1);
                                                setLabels(tmp);
                                                let tmp1 = input1.slice();
                                                tmp1.splice(idx, 1);
                                                setInput1(tmp1);
                                            }}
                                            shape="circle" icon={<CloseOutlined />} />
                                </Tooltip>}
                                   onChange={(k)=>{changeInput(k,idx)}} value={input1[idx]}/>
                        </div>
                    )
                })
            }
            <div className={aI}>
                <PlusOutlined onClick={addLabel}/>
            </div>
            <div className={aInput}>
                <Input onChange={(e)=>{setInput(e.target.value)}} value={input}
                       onPressEnter={inputConfirm} placeholder="请输入label，完成回车即可"/>
            </div>
        </div>
    )
}