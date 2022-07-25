import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import dagre from 'dagre';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MiniMap,
  Background,
} from 'react-flow-renderer';
import { useDispatch } from 'react-redux';
import { ActSetState } from '../../lib/state/global';
import { useTypedSelector } from '../../lib/store';
// import chain_data from "./initial-elements"
import sty from './index.module.scss';
import {Modal,Select,AutoComplete,message} from 'antd'
import Const from '../../lib/constant';
const { Option } = Select;

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [rfInstance, setRfInstance] = useState(null);
  const dispatch = useDispatch()
  const rf = useTypedSelector(e=>e.PAGlobalReducer.rfIns)
  const chain = useTypedSelector(e=>e.PAGlobalReducer.chain)
  const allPatients = useTypedSelector(e=>e.PAGlobalReducer.all_patients)
  const all_chain_versions = useTypedSelector(e=>e.PAGlobalReducer.all_chain_versions)
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const [isModalVisible,setIMV] = useState(false)
  const [isLoadModalVisible,setILMV] = useState(false)
  const [newNode,setNewNode] = useState(null)
  const [Modalvs,setModalvs] = useState(false);
  const [edge,setEdge] = useState(null);
  const [relation,setRelation] = useState(null);
  const [version,setVersion] = useState("origin")
  var num = 0;
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 130;

  const getLayoutedElements =useCallback((tmpnodes, tmpedges, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
    tmpnodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    tmpedges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    tmpnodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? 'left' : 'top';
      node.sourcePosition = isHorizontal ? 'right' : 'bottom';

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth/2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      return node;
    });
    return {tmpnodes,tmpedges}
  },[]);
  const onLayout = useCallback(
    (direction) => {
      const {tmpnodes:layoutedNodes,tmpedges:layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );
  const onEdgeClick = useCallback((event,edge)=>{
    setEdge(edge);
    setModalvs(true);
  },[edge]);
  const onEdgeContextMenu = useCallback((event,edge)=>{
    console.log("edge id :"+ edge.id)
    const newedge = []
    edges.map((item)=>{
      console.log(item.id)
      if(item.id != edge.id) {
        newedge.push(item)
      }
    })
    console.log(newedge)
    setEdges(newedge) 
  })
  const setEdgeDetail=useCallback(()=>{
    if(relation != null) {
          setModalvs(false);
          setEdges((els)=>
          els.map((eg)=>{
            if(eg.id === edge.id) {
              edge.label=relation;
              edge.labelShowBg = false;
              return edge;
            }else return eg;
          }))
          setRelation(null);
        }
  },[relation]);

  const loadChain = ()=>{
    axios.post(`${Const.testserver}/get_chain`,{
      pid:"0",
      version:version
    })
    .then(e=>{dispatch(ActSetState({chain:e.data}))})
  }

  const onAddNode=()=>{
    axios.get(`${Const.testserver}/get_all_patients`)
    .then(e=>{
      dispatch(ActSetState({
        all_patients:e.data
      }))
    })
    .then(e=>{
      setIMV(true)
    })
  }

  const addNode=()=>{
    if (newNode){
      let ptype = newNode.type
      const n = {
        id: "added_node-" + newNode.pid,
        name: newNode.name,
        pid: newNode.pid,
        data:{
          label: 
          <div>
            <span style={{fontWeight:'bolder',fontSize:'15px',color:(newNode.type == "确诊")? 'white':'black'}}>{newNode.name}</span><br/>
            <sapn style={{color:(newNode.type == "确诊")? 'white':'black'}}>{newNode.gender==1?"男":"女"} {newNode.type}</sapn><br/>
            <sapn style={{color:(newNode.type == "确诊")? 'white':'black'}}>确诊日期: {newNode.diagnosedDate}</sapn><br/>
            <sapn style={{color:(newNode.type == "确诊")? 'white':'black'}}>电话: {newNode.phone}</sapn>
          </div>
        },
        position:{
          x: Math.random() * 800,
          y: 0
        },
        style:{borderRadius:20,padding:1,border:"1px solid #555"},
      }
      if(ptype==="确诊") {
        n.style = { ...n.style, backgroundColor: '#8B0000' };
      }else if(ptype === "无症状感染") {
        n.style = { ...n.style, backgroundColor: '#EEAD0E' };
      }
      setNodes((nodes)=>nodes.concat(n))
    }
    else{
      console.log("no node")
    }
  }

  const onSave=()=>{
    let rnodes = []
    let redges = []
    nodes.forEach((node)=>{
      rnodes.push({
        id: node.id,
        pid: node.pid,
        name: node.name
      })
    })
    edges.forEach((edge)=>{
      redges.push({
        source: edge.source,
        target: edge.target,
        relation: edge.label,
        isTruth: edge.animated?0:1
      })
    })
    axios.post(`${Const.testserver}/save_chain`,{
      nodes:rnodes,
      edges:redges
    }).then(()=>{message.success('保存成功');})
  }

  const onLoad=()=>{
    axios.get(`${Const.testserver}/get_all_versions`)
    .then(e=>{
      dispatch(ActSetState({
        all_chain_versions:e.data
      }))
    })
    .then(e=>{
      setILMV(true)
    })
  }

  useEffect(()=>{
    if (!chain) return;
    setNodes([])
    setEdges([])
    chain.nodes.forEach((person) => {
      const newNode = {
        id: "node-" + num,
        name: person.name,
        pid: person.pid,
        data:{
          label: 
          <div>
            <span style={{fontWeight:'bolder',fontSize:'15px',color:(person.type == "确诊")? 'white':'black'}}>{person.name}</span><br/>
            <span style={{color:(person.type == "确诊")? 'white':'black'}}>{person.gender==1?"男":"女"} {person.type}</span><br/>
            <span style={{color:(person.type == "确诊")? 'white':'black'}}>确诊日期: {person.diagnosedDate}</span><br/>
            <span style={{color:(person.type == "确诊")? 'white':'black'}}>电话: {person.phone}</span>
          </div>
        },
        position:{
          x: Math.random() * 800,
          y: person.level*100
        },
        style:{borderRadius:20,padding:1,border:"1px solid #555"},
      }
      num++;
      if(person.type==="确诊") {
        newNode.style = { ...newNode.style, backgroundColor: '#8B0000' };
      }else if(person.type === "无症状感染") {
        newNode.style = { ...newNode.style, backgroundColor: '#EEAD0E' };
      }
      setNodes((nodes)=>nodes.concat(newNode))
    });
     chain.edges.forEach((edge) => {
        const newEdge = {
          id: edge.id,
          label:edge.relation,
          source: "node-" + edge.source,
          target: "node-" + edge.target,
          animated: !(edge.isTruth == 1)
        }
        newEdge.labelShowBg = false;
        setEdges((edges)=>edges.concat(newEdge))
     });
  },[chain]);

  return (
    <>
    <ReactFlowProvider>
      <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
      onEdgeClick={onEdgeClick}
      onEdgeContextMenu={onEdgeContextMenu}
    >
      <div style={{"position": "absolute","right": "50px","top": "10px","zIndex": "4","fontSize": "12px"}}>
        <button className={sty.Btn} onClick={()=>{onSave()}}>保存</button>
        <button className={sty.Btn} onClick={()=>{onLoad()}}>加载</button>
        <button className={sty.Btn} onClick={()=>{onAddNode()}}>新增节点</button>
        <button className={sty.Btn} onClick={() => onLayout('TB')}>垂直布局</button>
        <button className={sty.Btn} onClick={() => onLayout('LR')}>水平布局</button>
      </div>
      {<MiniMap/>}
    </ReactFlow>
    </ReactFlowProvider>
    <Modal title="新增节点" visible={isModalVisible} onOk={()=>{addNode(),setIMV(false)}} onCancel={()=>{setNewNode(null),setIMV(false)}}>
      <Select style={{ width: 120 }} onChange={(value)=>{
        let p = allPatients.find(e=>e.pid===value)
        console.log(p)
        setNewNode(p)
      }}>
        {
          allPatients?
          allPatients.map((e,i)=>(
            <Option value={e.pid}>{e.name}</Option>
          )):
          null
        }
      </Select>
    </Modal>
    <Modal title="添加关系" visible={Modalvs} onOk={setEdgeDetail} onCancel={()=>{setModalvs(false)}}>
      <AutoComplete
        style={{width: 200}}
        placeholder="input here"
        allowClear="true"
        value={relation}
        onChange={(value)=>setRelation(value)}
      />
    </Modal>
    <Modal title="加载传播链" visible={isLoadModalVisible} onOk={()=>{loadChain(),setILMV(false)}} onCancel={()=>{setILMV(false)}}>
      <Select style={{ width: 300 }} onChange={(value)=>{
        setVersion(value)
      }}>
        {
          all_chain_versions?
          all_chain_versions.map((e,i)=>(
            <Option value={e}>{e}</Option>
          )):
          null
        }
      </Select>
    </Modal>
    </>
  );
};

export default SaveRestore;