import { Col, Row, Select, Statistic, Switch,Card } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import Const from "../../lib/constant"
import { useTypedSelector } from "../../lib/store"
import Constant from "../../lib/constant"
import sty from './index.module.scss'
import { useDispatch } from "react-redux"
import { ActSetState } from "../../lib/state/global"
import ReactDOM from 'react-dom'
import G6 from "@antv/g6"
import { useRef } from "react"
import { replaceAt } from "../../lib/utils"

export default function PageOverview() {
  const patinetMap = useTypedSelector(e=>e.PAGlobalReducer.patient_map)
  const dispatch = useDispatch()
  const [total_patients,setTP] = useState(0)
  const [total_locations,setTL] = useState(0)
  const [total_contacts,setTC] = useState(0)
  const [max_location_name,setMLN] = useState("")
  const [max_location_pp,setMLP] = useState(0)
  const [total_accompany,setTA] = useState(0)
  const [max_accompany_name,setMAN] = useState("")
  const [max_accompany_num,setMANum] = useState(0)
  const [max_contact_name,setMCN] = useState("")
  const [max_contact_num,setMCNum] = useState(0)
  const [unprotection_rate,setUR] = useState(0)
  const ref = useRef(null)
  useEffect(()=>{
    axios.get(`${Constant.testserver}/get_patientmap_d_t_all`)
      .then(e=>{
        console.log(e.data)
        dispatch(ActSetState({patient_map:e.data}))
      })
    axios.get(`${Constant.testserver}/get_statistics`)
      .then(e=>{
        setTP(e.data.total_patients)
        setTL(e.data.total_locations)
        setTC(e.data.total_contacts)
        setMLN(e.data.max_location_name)
        setMLP(e.data.max_location_pp)
        setTA(e.data.total_accompany)
        setMAN(e.data.max_accompany_name)
        setMANum(e.data.max_accompany_num)
        setMCN(e.data.max_contact_name)
        setMCNum(e.data.max_contact_num)
        setUR(e.data.unprotection_rate)
        console.log(e.data)
      })
  },[])
  useEffect(()=>{
    if (!patinetMap){
      return
    }
    const colorMap = {
      "patient":"#EB1D36",
      "contact":"#FAEA48"
    }
    const refreshDragedNodePosition= (e) => {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }
    const container = document.getElementById('container_overview');
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const graph = new G6.Graph({
      container: ReactDOM.findDOMNode(ref.current),
      width,
      height,
      layout: {
        type: 'force',
        preventOverlap: true,
        linkDistance: (d) => {
          if (d.type === '时空伴随') {
            return 100;
          }
          return 60;
        },
        // edgeStrength: (d) => {
        //   if (d.type === "密接") {
        //     return 0.1;
        //   }
        //   return 0.1;
        // },
      },
      defaultNode: {
        color: '#5B8FF9',
      },
      modes: {
        default: ['drag-canvas'],
      },
    });

    // const data = {
    //   nodes: [
    //     { id: 'node0', size: 50 },
    //     { id: 'node1', size: 30 },
    //     { id: 'node2', size: 30 },
    //     { id: 'node3', size: 30 },
    //     { id: 'node4', size: 30, isLeaf: true },
    //     { id: 'node5', size: 30, isLeaf: true },
    //     { id: 'node6', size: 15, isLeaf: true },
    //     { id: 'node7', size: 15, isLeaf: true },
    //     { id: 'node8', size: 15, isLeaf: true },
    //     { id: 'node9', size: 15, isLeaf: true },
    //     { id: 'node10', size: 15, isLeaf: true },
    //     { id: 'node11', size: 15, isLeaf: true },
    //     { id: 'node12', size: 15, isLeaf: true },
    //     { id: 'node13', size: 15, isLeaf: true },
    //     { id: 'node14', size: 15, isLeaf: true },
    //     { id: 'node15', size: 15, isLeaf: true },
    //     { id: 'node16', size: 15, isLeaf: true },
    //   ],
    //   edges: [
    //     { source: 'node0', target: 'node1' },
    //     { source: 'node0', target: 'node2' },
    //     { source: 'node0', target: 'node3' },
    //     { source: 'node0', target: 'node4' },
    //     { source: 'node0', target: 'node5' },
    //     { source: 'node1', target: 'node6' },
    //     { source: 'node1', target: 'node7' },
    //     { source: 'node2', target: 'node8' },
    //     { source: 'node2', target: 'node9' },
    //     { source: 'node2', target: 'node10' },
    //     { source: 'node2', target: 'node11' },
    //     { source: 'node2', target: 'node12' },
    //     { source: 'node2', target: 'node13' },
    //     { source: 'node3', target: 'node14' },
    //     { source: 'node3', target: 'node15' },
    //     { source: 'node3', target: 'node16' },
    //   ],
    // };
    const data = {nodes:[],edges:[]}
    patinetMap.node_list.forEach((node,idx) => {
      let g6_node = {
        id:`node-${idx}`,
        pid:node.pid,
        name:node.name,
        label:replaceAt(node.name,1,"某"),
        gender:node.gender,
        size:node.type=="patient"?40:25,
        type:node.type
      }
      // if (node.type=="patient")
        data.nodes.push(g6_node)
    });
    patinetMap.edge_list.forEach((edge,idx) => {
      let g6_edge = {
        id:`edge-${idx}`,
        source:`node-${edge.source}`,
        target:`node-${edge.target}`,
        location:edge.location,
        type:edge.type
      }
      data.edges.push(g6_edge)
    });
    console.log(data.nodes)
    console.log(data.edges)
    graph.data({
      nodes:data.nodes,
      edges:data.edges.map(function (edge, i) {
          edge.id = 'edge' + i;
          return Object.assign({}, edge);
          }),
    });
    data.nodes.forEach((i) => {
      i.style = Object.assign(i.style || {}, {
        fill: colorMap[i.type],
      });
    });
    graph.clear()
    graph.render();

    graph.on('node:dragstart', function (e) {
      graph.layout();
      refreshDragedNodePosition(e);
    });
    graph.on('node:drag', function (e) {
      refreshDragedNodePosition(e);
    });
    graph.on('node:dragend', function (e) {
      e.item.get('model').fx = null;
      e.item.get('model').fy = null;
    });

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };
  },[patinetMap])
  return (
    <MainLayout>
          <div id="container_overview" ref={ref} style={{height:"90vh"}}/>
          <Card title={"关联图谱信息统计"} style={{"position":"fixed","top":"100px","right":"30px","width":"20vw"}}>
            <Row>
              <Col span={12}>
                <Statistic
                  title={"总确诊人数"}
                  value={total_patients}
                  valueStyle={{ color: '#0096ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={"总密接人数"}
                  value={total_contacts}
                  valueStyle={{ color: '#0096ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={"总风险位点"}
                  value={total_locations}
                  valueStyle={{ color: '#0096ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={"总时空伴随"}
                  value={total_accompany}
                  valueStyle={{ color: '#0096ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={"最多经停"}
                  value={`${max_location_name}(${max_location_pp}人次)`}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={"最多伴随病例"}
                  value={`${max_accompany_name}(${max_accompany_num}人次)`}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={"最多密接病例"}
                  value={`${max_contact_name}(${max_contact_num}人)`}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={"无防护比例"}
                  value={unprotection_rate*100}
                  precision={2}
                  valueStyle={{ color: '#ffc23c' }}
                  suffix={"%"}
                />
              </Col>
            </Row>
          </Card>
    </MainLayout>
  )
}