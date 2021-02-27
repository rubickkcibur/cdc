import {Button,Col,Row,Select,Slider,Radio,Popover,AutoComplete} from "antd";
import { DownOutlined } from '@ant-design/icons';
import DescriptionsItem from "antd/lib/descriptions/Item";
import React, { useDebugValue, useEffect, useState } from "react";
import MainLayout from "../../components/MainLayoout/PageLayout"
import { useTypedSelector } from "../../lib/store";
import sty from './index.module.scss'
import { BaseItem, Node, Basic } from '../../lib/types/types'
import { ColumnsType } from "antd/lib/table";
import { extracDate } from "../../lib/utils";
import { useDispatch } from "react-redux";
import {ActRemovePauses, ActSetState} from "../../lib/state/global";
import Axios from "axios";
import Constant from '../../lib/constant'
import Search from "antd/lib/input/Search";
import { useRouter } from "next/dist/client/router";


export default function Pageanalyse() {

  const { Option } = Select;
  const [isHidden,setIsHidden]=useState(sty.show);
  const content = (
        <div>
            <div style={{fontSize:'18px',fontWeight:'bold'}}>病例3</div>
            <div><span style={{fontWeight:'bold'}}>张某某</span>，女，31岁</div>
            <div><span style={{fontWeight:'bold'}}>家庭住址:</span>顺义区高丽营镇张喜庄村</div>
            <div><span style={{fontWeight:'bold'}}>工作地点:</span>顶全便利店顺义区货运店</div>
        </div>
    );
  const content1 = (
        <div>
            <div><span style={{fontWeight:'bold'}}>气温:5℃</span></div>
            <div><span style={{fontWeight:'bold'}}>天气:晴</span></div>
            <div><span style={{fontWeight:'bold'}}>风向:东北风四级</span></div>
            <div><span style={{fontWeight:'bold'}}>人流量:大</span></div>
            <div><span style={{fontWeight:'bold'}}>当前时间点患者:</span>
                <Button type="link" danger>
                    病例2
                </Button>
                ，
                <Button type="link" danger>
                    病例8
                </Button>
            </div>
        </div>
    );
  const [changePic,setChangePic]=useState(sty.picture00);
  const[pict,setPict]=useState(<div>
        <div className={changePic}>
            <Row></Row>
            <Popover content={content} title="病例信息" trigger="click">
                <div className={sty.click}></div>
            </Popover>
        </div>
    </div>);
  const changeSlider = (value:any) => {
        if(value<=30){
            setChangePic(sty.picture001);
        }
        else if(value>30&&value<=60){
            setChangePic(sty.picture002);
        }
        else{
            setChangePic(sty.picture00);
        }
      setPict(
          <div>
              <div className={changePic}>
                  <Row></Row>
                  <Popover content={content} title="病例信息" trigger="click">
                      <div className={sty.click}></div>
                  </Popover>
              </div>
          </div>
      )
    };
  const [type,setType] = useState<string>("1");
  const options = [
        { value: '病例1——周某某' },
        { value: '病例7——李某某' },
        { value: '病例15——王某' },
  ];
  const Complete: React.FC = () => (
        <AutoComplete
            style={{ width: 200 }}
            options={options}
            placeholder="请输入患者姓名"
            filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
        );
  const marks = {
        0: '12月1日',
        100: '1月19日',
  };
  const onChange = (e:any) => {
      setType(e.target.value);
      if(type=="2"){
          setPict(
              <div>
                  <div className={changePic}>
                      <Row></Row>
                      <Popover content={content} title="病例信息" trigger="click">
                          <div className={sty.click}></div>
                      </Popover>
                  </div>
              </div>
          )
          setIsHidden(sty.show)
      }
      else{
          setPict(
              <div style={{marginTop:'15px',height:'577px',width:'100%'}}>
                  <Row>
                      <Col span={2}></Col>
                      <Col span={6}>
                          <div style={{fontSize:'20px'}}>患者轨迹空间分析</div>
                          <div style={{marginLeft:'25px',marginTop:'10px'}}>
                              请输入患者姓名&nbsp;&nbsp;
                              <Complete/>
                          </div>
                          <div style={{marginTop:'20px',marginLeft:'30px'}}>
                              已选择密接者&nbsp;&nbsp;&nbsp;
                              <Button type="primary" style={{color:'black'}}>周某某</Button>
                              <Button type="primary" danger style={{color:'black',marginLeft:'10px'}}>王某某</Button>
                          </div>
                      </Col>
                      <Col span={6}></Col>
                      <Col span={7}>
                          <div style={{fontSize:'20px'}}>患者轨迹时间分析</div>
                          <div style={{marginLeft:'25px',marginTop:'10px'}}>
                              <Row>
                                  <Col span={6} style={{marginTop:'5px'}}>请选择时间点&nbsp;&nbsp;</Col>
                                  <Col span={18}><Slider marks={marks} defaultValue={100} /></Col>
                              </Row>
                          </div>
                      </Col>
                      <Col span={3}></Col>
                  </Row>
                  <div style={{marginTop:'10px',height:'426px'}}>
                      <Row style={{height:'426px'}}>
                          <Col span={1}></Col>
                          <Col span={11}>
                              <div className={sty.picture01}></div>
                          </Col>
                          <Col span={4}></Col>
                          <Col span={7}>
                              <div className={sty.picture02}>
                                  <Row></Row>
                                  <Popover content={content1} title="金马工业区" trigger="click">
                                      <div className={sty.click01}></div>
                                  </Popover>
                              </div>
                          </Col>
                          <Col span={1}></Col>
                      </Row>
                  </div>
              </div>
          )
          setIsHidden(sty.hidden)
      }
  };
  return(
      <MainLayout>
        <div className={sty.Table}>
          <Row>
              <Col span={4}>
                  <Select defaultValue="1" style={{ width: 180,fontSize:'22px' }} bordered={false}>
                  <Option value="1">北京顺义疫情</Option>
                  <Option value="2">北京大兴疫情</Option>
                  <Option value="3">河北石家庄疫情</Option>
                  <Option value="4">北京新发地疫情</Option>
                  </Select>
              </Col>
              <Col style={{marginTop:'1px'}} span={6}>
                  <Row className={isHidden}>
                      <Col span={5} style={{marginTop:'4px'}}>聚合距离差:</Col>

                      <Col span={4}>
                          <Select defaultValue="01" style={{ width: 70 }}>
                              <Option value="01">小于</Option>
                              <Option value="02">大于</Option>
                              <Option value="03">等于</Option>
                          </Select>
                      </Col>

                      <Col span={1}></Col>

                      <Col span={6}>
                          <Slider defaultValue={100} onChange={(value:any) => changeSlider(value)}/>
                      </Col>

                      <Col span={1}></Col>

                      <Col span={4}>
                          <Select defaultValue="01" style={{ width: 70 }}>
                              <Option value="01">米</Option>
                              <Option value="02">千米</Option>
                          </Select>
                      </Col>
                      <Col span={3}></Col>
                  </Row>
              </Col>
              <Col style={{marginTop:'1px'}} span={6}>
                  <Row className={isHidden}>
                      <Col span={5} style={{marginTop:'4px'}}>聚合时间差:</Col>

                      <Col span={4}>
                          <Select defaultValue="01" style={{ width: 70 }}>
                              <Option value="01">小于</Option>
                              <Option value="02">大于</Option>
                              <Option value="03">等于</Option>
                          </Select>
                      </Col>

                      <Col span={1}></Col>

                      <Col span={6}>
                          <Slider defaultValue={100} />
                      </Col>

                      <Col span={1}></Col>

                      <Col span={4}>
                          <Select defaultValue="01" style={{ width: 70 }}>
                              <Option value="01">分钟</Option>
                              <Option value="02">小时</Option>
                              <Option value="03">日</Option>
                          </Select>
                      </Col>
                      <Col span={3}></Col>
                  </Row>
              </Col>
              <Col span={3}></Col>
              <Col span={5}>
                  <Radio.Group defaultValue="1" onChange={(e)=>onChange(e)}>
                      <Radio.Button value="1">聚合传播关系图</Radio.Button>
                      <Radio.Button value="2">时空传播关系图</Radio.Button>
                  </Radio.Group>
              </Col>
          </Row>

          <div>
              {pict}
          </div>

        </div>
      </MainLayout>
  )

}