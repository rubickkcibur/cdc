import React, { PureComponent } from 'react'
import {Row, Col, Card} from 'antd';
import dynamic from "next/dynamic";


const JTopo = dynamic(
  () => {
    return import("jtopo-in-node");
  },
  { ssr: false }
);

class DeviceGraph extends React.Component{
  state = {
    canvasWidth: '300',
    position: [],
    allSensors: []
  };
  componentDidMount() {
    var canvas = this.refs.test;
    canvas.width = window.innerWidth * 0.95;
    this.setState({
      canvasWidth: window.innerWidth * 0.95
    });
  }

  node = (scene, x, y, img) => {
    var node = new JTopo.Node();
    node.setImage('http://www.jtopo.com/demo/img/statistics/' + img, true);
    node.setLocation(x, y);
    node.dragable = false;
    node.fontColor = '0,0,0';
    scene.add(node);
    return node;
  };

  linkNode = (scene,nodeA, nodeZ, f) => {
    var link;
    if(f){
      link = new JTopo.FoldLink(nodeA, nodeZ, "test");
    }else{
      link = new JTopo.Link(nodeA, nodeZ);
    }
    link.direction = 'vertical';
    scene.add(link);
    return link;
  };

  hostLink = (scene, nodeA, nodeZ) => {
    var link = new JTopo.FlexionalLink(nodeA, nodeZ);
    link.shadow = false;
    link.offsetGap = 44;
    scene.add(link);
    return link;
  };

  render(){
    console.log('JTopo', JTopo);

    // canvas元素存在之后再进行操作
    if(this.refs.test){
      var stage = new JTopo.Stage(this.refs.test);
      stage.eagleEye.visible = null;
      stage.wheelZoom = 0.95;
      var scene = new JTopo.Scene(stage);
      scene.background = 'http://www.jtopo.com/demo/img/bg.jpg';

      var s1 = this.node(scene,305, 43, 'server.png');
      s1.alarm = '2 W';
      var s2 = this.node(scene,365, 43, 'server.png');
      var s3 = this.node(scene,425, 43, 'server.png');

      var g1 = this.node(scene,366, 125, 'gather.png');
      this.linkNode(scene,s1, g1, true);
      this.linkNode(scene,s2, g1, true);
      this.linkNode(scene,s3, g1, true);

      var w1 = this.node(scene,324, 167, 'wanjet.png');
      this.linkNode(scene,g1, w1);

      var c1 = this.node(scene,364, 214, 'center.png');
      this.linkNode(scene,w1, c1);

      var cloud = this.node(scene,344, 259, 'cloud.png');
      this.linkNode(scene,c1, cloud);

      var c2 = this.node(scene,364, 328, 'center.png');
      this.linkNode(scene,cloud, c2);

      var w2 = this.node(scene,324, 377, 'wanjet.png');
      this.linkNode(scene,c2, w2);

      var g2 = this.node(scene,366, 411, 'gather.png');
      this.linkNode(scene,w2, g2);

      var h1 = this.node(scene,218, 520, 'host.png');
      h1.alarm = '';
      this.hostLink(scene,g2, h1);
      var h2 = this.node(scene,292, 520, 'host.png');
      this.hostLink(scene,g2, h2);
      var h3 = this.node(scene,366, 520, 'host.png');
      h3.alarm = '二级告警';
      h3.text = 'h3';
      this.hostLink(scene,g2, h3);
      var h4 = this.node(scene,447, 520, 'host.png');
      this.hostLink(scene,g2, h4);
      var h5 = this.node(scene,515, 520, 'host.png');
      h5.alarm = '1M';
      this.hostLink(scene,g2, h5);

      stage.setCenter(515, 520)

      setInterval(function(){
        if(h3.alarm == '二级告警'){
          h3.alarm = null;
          h3.text = 'h3'+ Math.random()
        }else{
          h3.alarm = '二级告警'
        }
      }, 600);

    }

    return(
      <Row>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} >
          <Card  style={{textAlign: "center" ,width:"100%", height: '650px', marginBottom: '20px'}}>
            <canvas ref="test" width= {'300px'}  height={'600px'} />
          </Card>
        </Col>
      </Row>
    )
  }

}

export default DeviceGraph;