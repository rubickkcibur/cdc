import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
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
import chain_data from "../../../../format_sample/chain_format.json";
import sty from './index.module.scss';

const SaveRestore = () => {
  
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [rfInstance, setRfInstance] = useState(null);
  const dispatch = useDispatch()
  const rf = useTypedSelector(e=>e.PAGlobalReducer.rfIns)
  const chain = useTypedSelector(e=>e.PAGlobalReducer.chain)
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const [show,setShow] = useState(0);
  var num = 0;
  useEffect(()=>{
    if (!chain) return;
    chain.nodes.forEach((person) => {
      const newNode = {
        id: "node-" + num,
        data:{
          label: 
          <div>
            <span style={{fontWeight:'bolder',fontSize:'25px',color:(person.type == "确诊")? 'white':'black'}}>{person.name}</span><br/>
            <span style={{fontWeight:'bolder',color:(person.type == "确诊")? 'white':'black'}}>{person.gender}</span>
            <span style={{fontWeight:'bolder',color:(person.type == "确诊")? 'white':'black'}}>  {person.type}</span><br/>
            <span style={{fontWeight:'bolder',color:(person.type == "确诊")? 'white':'black'}}>确诊日期: {person.diagnosedTime}</span><br/>
            <span style={{fontWeight:'bolder',color:(person.type == "确诊")? 'white':'black'}}>电话: {person.phone}</span>
          </div>
        },
        position:{
          x: Math.random() * 800,
          y: person.level*100
        }
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
        }
        newEdge.labelShowBg = false;
        setEdges((edges)=>edges.concat(newEdge))
     });
  },[chain]);

  return (
    <ReactFlowProvider>
      <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
    >
      {/* <Pop/> */}
      <div style={{"position": "absolute","right": "50px","top": "10px","z-index": "4","font-size": "12px"}}>
        <button className={sty.Btn}>save</button>
        <button className={sty.Btn}>restore</button>
        <button className={sty.Btn}>add node</button>
        <button className={sty.Btn} onClick={()=>{dispatch(ActSetState({chain:chain_data}))}}>dispatch</button>
      </div>
      {<MiniMap/>}
    </ReactFlow>
    </ReactFlowProvider>
  );
};

export default SaveRestore;