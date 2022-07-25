import G6 from '@antv/g6';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTypedSelector } from '../../lib/store';
let graph = null;
let contact_types = ['同居','同事','同学','同车','共餐','同行','短暂接触','开会'];

export default function RelationMap(){
    const relatedMap = useTypedSelector(e=>e.PAGlobalReducer.relatedMap);
    const ref = React.useRef(null);
    let flag = true;
    
    
    function refreshDragedNodePosition(e) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }

    useEffect(()=>{
        if(!relatedMap) return;
    
        const mapContainer = document.getElementById('mapContainer');
        const width = mapContainer.scrollWidth;
        const height = mapContainer.scrollHeight || 500;
        if(!graph){
            graph = new G6.Graph({
            container: ReactDOM.findDOMNode(ref.current),
            //   container: 'container',
              width,
              height,
              layout: {
                type: 'force',
                linkDistance: 200, 
                clusterNodeSize: 20,
              },
              modes: {
                default: ['zoom-canvas', 'drag-canvas', 'drag-node'],
              },
              defaultNode: {
                size: 25,
              },
            });
            console.log('新建一张图')
        }


            console.log('在component组件里的数据'+relatedMap)
            console.log(relatedMap)
    // fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json')
    // .then((res) => res.json())
    // .then((data) => {
    //   graph.data({
    //     nodes: data.nodes,
    //     edges: data.edges.map(function (edge, i) {
    //       edge.id = 'edge' + i;
    //       return Object.assign({}, edge);
    //     }),
    //   });
      const node_persons = relatedMap[0].node_persons ;
      const nodes = []
      node_persons.forEach((node)=>{
        if(node.pid != null){
          nodes.push({
          id:node.pid,
          label:node.name,
          style:{
            fill:'#C9BBCF',
            stroke:'blue',
          },
          ...node
        })
        }else{
          nodes.forEach((node2)=>{
            if(node2.id == node.name&& node2.pid == null){
              flag  = false;
            }
          })
          if(flag){
            nodes.push({
            id:node.name,
            label:node.name,
            style:{
              fill:'#B7D3DF',
              stroke:'blue',
            },
            ...node
          })
          }
          console.log('添加一个密接节点'+node)
          flag = true;
        }
        
      });    
      const this_node = {
        id:`${relatedMap[0].pid}`,
        label:`${relatedMap[0].name}`,
        size:50
      }
      nodes.push(this_node);
      let edge_relation = relatedMap[0].edge_relation;
      const edges=[]
      edge_relation.forEach((edge)=>{
        edges.forEach((edge_exist)=>{
          if(edge_exist.source == edge.pid1 && edge_exist.target == edge.pid2 && (edge_exist.distance > 0 == edge.distance > 0)){
            flag = false;
          }
        })
        if(edge.contact_type != null){
     
          if(flag){
             edges.push({
                source : edge.pid1,
                target : edge.pid2,
                label:`${contact_types[edge.contact_type]}`,
                labelCfg:{
                  autoRotate:true,
                },
                style:{
                   
                   stroke:'#B7D3DF'
                },
                ...edge
            // edge.value = 1;
            });
          }
          flag = true;
        }else if(edge.distance != 0){
          if(flag){
             let edge_this = {
              source : edge.pid1,
              target : edge.pid2,
              label:`${edge.crushlocationname}(${edge.crushtime})`,
              labelCfg:{
                autoRotate:true,
              },
              style:{
                stroke:'#C9BBCF',
              },
              ...edge
            // edge.value = 1;
            };
            const text = `${edge_this.label}`;
            console.log('0000000000')
            console.log(text)
            if(text.length > 25){
              edge_this.label = `${edge_this.label.substr(0, 25)}...`;
              
              console.log(edge.label)
            }
            edges.push(edge_this);
          }
           flag = true;
        }
      });  
      G6.Util.processParallelEdges(edges);
      console.log('修改完毕后的节点和边边是')

      console.log(nodes);
      console.log(edges);
      
      graph.data({
        nodes:nodes,
        edges:edges.map(function (edge, i) {
            edge.id = 'edge' + i;
            return Object.assign({}, edge);
            }),
      });

      graph.clear();
      graph.render();
//    graph.changeData();
  
      graph.on('node:dragstart', function (e) {
        graph.layout();
        refreshDragedNodePosition(e);
      });
      graph.on('node:drag', function (e) {
        const forceLayout = graph.get('layoutController').layoutMethods[0];
        forceLayout.execute();
        refreshDragedNodePosition(e);
      });
      graph.on('node:dragend', function (e) {
        e.item.get('model').fx = null;
        e.item.get('model').fy = null;
      });
  
      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!mapContainer || !mapContainer.scrollWidth || !mapContainer.scrollHeight) return;
          graph.changeSize(mapContainer.scrollWidth, mapContainer.scrollHeight);
        };
    },[relatedMap]);
    return (
        <div id="mapContainer" ref={ref}></div>
    )
}