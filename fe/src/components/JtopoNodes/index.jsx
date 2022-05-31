import React, { createRef, PureComponent, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import {Row, Col, Card} from 'antd';
import dynamic from "next/dynamic";
import JTopo from "jtopo-in-node";
import { count } from 'rxjs/operators';
import { useTypedSelector } from "../../lib/store";
import { strtoll } from '../PathForm';


const interSection = (a,b,n)=>{
  let counter = new Array(n).fill(0)
  for(let i=0;i<a.length;i++){
    counter[a[i]] += 1
  }
  for(let j=0;j<b.length;j++){
    if (counter[b[j]] >= 1){
      return b[j]
    }
  }
  return -1
}


// const JTopo = dynamic(
//   () => {
//     return import("jtopo-in-node");
//   },
//   { ssr: false }
// );

function DeviceGraph({cl}){
  const test = useRef(null);
  const [nod,setNode] = useState(null);
  const [sce,setS] = useState(null);
  const aggrGraph = useTypedSelector(e=>e.PAGlobalReducer.aggrGraph)

  useEffect(()=>{
    if(aggrGraph && sce){
      var num = aggrGraph.n
      var cliques = aggrGraph.cliques
      var containers = new Array(cliques.length).fill(null)
      var nodes = new Array(cliques.length).fill(null)
      for (let i=0;i<cliques.length;i++){
        var contain = new JTopo.Container("聚合" + i)
        sce.add(contain)
        containers[i] = contain
        var ns = new Array(cliques[i].length).fill(null)
        for(let j=0;j<cliques[i].length;j++){
          ns[j] = new JTopo.Node("病例" + cliques[i][j])
          sce.add(ns[j])
          contain.add(ns[j])
        }
        nodes[i] = ns
      }
    }
  },[aggrGraph])

  useEffect(()=>{
    console.log("outer",cl)
    if(test.current && sce){
      if(cl){
        var node = new JTopo.Node(0,0)
        setNode(node)
        sce.add(node)
        console.log("true",cl)
      }else{
        if(nod){
          sce.remove(nod)
          console.log("false",cl)
        }
      }
    }
  },[cl])

  useEffect(()=>{
    console.log('JTopo', JTopo);

    // canvas元素存在之后再进行操作
    if(test.current){
      console.log("test",test.current);
      var stage = new JTopo.Stage(test.current);
      var scene = new JTopo.Scene(stage);
      scene.background = 'http://www.jtopo.com/demo/img/bg.jpg';
      setS(scene);
      stage.add(scene);

    //   var container1 = new JTopo.Container('聚合1');
    //   scene.add(container1);
    //   var node11 = new JTopo.Node("病例1");                            
    //   node11.setLocation(409, 269);
    //   var node12 = new JTopo.Node("病例2");
    //   node12.setLocation(450,219);
    //   scene.add(node11);
    //   scene.add(node12);
    //   container1.add(node11);
    //   container1.add(node12);

    //   var container2 = new JTopo.Container('聚合2');
    //   scene.add(container2);
    //   var node21 = new JTopo.Node("病例1");
    //   node21.setLocation(269,409);
    //   var node22 = new JTopo.Node("病例3");
    //   node22.setLocation(219,450);
    //   scene.add(node21);
    //   scene.add(node22);
    //   container2.add(node21);
    //   container2.add(node22);

    //   scene.add(new JTopo.Link(node11,node21));
    }
  },[test])

  return(
    <Row>
      <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} >
        <Card  style={{textAlign: "center" ,width:"1800px", height: '750px', marginBottom: '20px'}}>
          <canvas ref={test} width="1800" height="750" />
        </Card>
      </Col>
    </Row>
  )
}
export default DeviceGraph;