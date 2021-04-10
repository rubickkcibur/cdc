import React, { createRef, PureComponent, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom';
import {Row, Col, Card} from 'antd';
import dynamic from "next/dynamic";
import JTopo from "jtopo-in-node";


// const JTopo = dynamic(
//   () => {
//     return import("jtopo-in-node");
//   },
//   { ssr: false }
// );

function DeviceGraph(){
  const test = useRef(null);
  useEffect(()=>{
    console.log('JTopo', JTopo);

    // canvas元素存在之后再进行操作
    if(test.current){
      console.log("test",test.current);
      var stage = new JTopo.Stage(test.current);
      var scene = new JTopo.Scene(stage);
      scene.background = 'http://www.jtopo.com/demo/img/bg.jpg';
      stage.add(scene);

      var container1 = new JTopo.Container('聚合1');
      scene.add(container1);
      var node11 = new JTopo.Node("病例1");                            
      node11.setLocation(409, 269);
      var node12 = new JTopo.Node("病例2");
      node12.setLocation(450,219);
      scene.add(node11);
      scene.add(node12);
      container1.add(node11);
      container1.add(node12);

      var container2 = new JTopo.Container('聚合2');
      scene.add(container2);
      var node21 = new JTopo.Node("病例1");
      node21.setLocation(269,409);
      var node22 = new JTopo.Node("病例3");
      node22.setLocation(219,450);
      scene.add(node21);
      scene.add(node22);
      container2.add(node21);
      container2.add(node22);

      scene.add(new JTopo.Link(node11,node21));
    }
  },[test])

  return(
    <Row>
      <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} >
        <Card  style={{textAlign: "center" ,width:"100%", height: '650px', marginBottom: '20px'}}>
          <canvas ref={test} width= {'800px'}  height={'700px'} />
        </Card>
      </Col>
    </Row>
  )
}


// class DeviceGraph extends React.Component{
//   constructor(){
//     super();
//     this.test = useRef(null);
//   }

//   render(){
//     console.log('JTopo', JTopo);

//     // canvas元素存在之后再进行操作
//     if(this.test.current){
//       console.log("test",this.test.current)
//       var stage = new JTopo.Stage(this.test);
//       stage.eagleEye.visible = null;
//       stage.wheelZoom = 0.95;
//       var scene = new JTopo.Scene(stage);
//       scene.background = 'http://www.jtopo.com/demo/img/bg.jpg';

//       var node = new JTopo.Node("Hello");                            
//       node.setLocation(409, 269);
//       scene.add(node);
//     }

//     return(
//       <Row>
//         <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} >
//           <Card  style={{textAlign: "center" ,width:"100%", height: '650px', marginBottom: '20px'}}>
//             <canvas ref={this.test} width= {'300px'}  height={'600px'} />
//           </Card>
//         </Col>
//       </Row>
//     )
//   }

// }

export default DeviceGraph;