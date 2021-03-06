import React from 'react';
export default [
  {
    id:"1",
    data:{
      label:(
        <>
          <strong>病例1（男）</strong>
          <p>28岁，长期在印度尼西亚生活，12月10日到达北京，在京居住地为顺义区，12月28日诊断为阳性。</p>
        </>
      )
    },
    position:{x:100, y:50},
    style:
    {
      width:400,
      background:"#108738",
      color:"#FFF"
    }
  },
  {
    id:"2",
    data:{
      label:(
        <>
          <strong>病例2（女）</strong>
          <p>29岁 12月25日确诊</p>
        </>
      )
    },
    position:{x:100, y:200},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"3",
    data:{
      label:(
        <>
          <strong>病例3（女）</strong>
          <p>31岁 12月26日确诊</p>
        </>
      )
    },
    position:{x:300, y:200},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"4",
    data:{
      label:(
        <>
          <strong>病例4（男）</strong>
          <p>34岁 12月23日诊断为阳性</p>
        </>
      )
    },
    position:{x:500, y:350},
    style:
    {
      background:"#108738",
      color:"#FFF"
    },
  
  },
  {
    id:"5",
    data:{
      label:(
        <>
          <strong>病例5（男）</strong>
          <p>31岁 12月26日确诊</p>
        </>
      )
    },
    position:{x:200, y:350},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"6",
    data:{
      label:(
        <>
          <strong>病例6（男）</strong>
          <p>40岁 12月28日确诊</p>
        </>
      )
    },
    position:{x:500, y:500},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"7",
    data:{
      label:(
        <>
          <strong>病例7（女）</strong>
          <p>31岁 12月25日确诊</p>
        </>
      )
    },
    position:{x:200, y:500},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"8",
    data:{
      label:(
        <>
          <strong>病例8（女）</strong>
          <p>32岁 12月26日确诊</p>
        </>
      )
    },
    position:{x:200, y:650},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"9",
    data:{
      label:(
        <>
          <strong>病例9（男）</strong>
          <p>33岁 12月26日确诊</p>
        </>
      )
    },
    position:{x:0, y:500},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"10",
    data:{
      label:(
        <>
          <strong>病例10（男）</strong>
          <p>31岁 12月26日确诊</p>
        </>
      )
    },
    position:{x:0, y:650},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"11",
    data:{
      label:(
        <>
          <strong>病例11（男）</strong>
          <p>43岁 12月28日确诊</p>
        </>
      )
    },
    position:{x:500, y:650},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"12",
    data:{
      label:(
        <>
          <strong>病例12（男）</strong>
          <p>32岁 12月28日确诊</p>
        </>
      )
    },
    position:{x:200, y:800},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"13",
    data:{
      label:(
        <>
          <strong>病例13（男）</strong>
          <p>28岁 12月28日确诊</p>
        </>
      )
    },
    position:{x:200, y:950},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"14",
    data:{
      label:(
        <>
          <strong>病例14（男）</strong>
          <p>42岁 12月28日确诊</p>
        </>
      )
    },
    position:{x:200, y:1100},
    style:
    {
      background:"#e06666",
      color:"#FFF"
    }
  },
  {
    id:"e1-1",
    source:"1",
    target:"2",
    style:{
      stroke:"#e06666"
    },
    type:"smoothstep",
    label:"合租"
  },
  {
    id:"e1-3",
    source:"1",
    target:"3",
    style:{
      stroke:"#e06666"
    },
    type:"smoothstep",
    label:"购物"
  },
  {
    id:"e3-4",
    source:"3",
    target:"4",
    style:{
      stroke:"#e06666"
    },
    type:"smoothstep",
    label:"购物"
  },
  {
    id:"e3-5",
    source:"3",
    target:"5",
    style:{
      stroke:"#e06666"
    },
    type:"smoothstep",
    label:"丈夫"
  },
  {
    id:"e3-6",
    source:"3",
    target:"6",
    style:{
      stroke:"#e06666"
    },
    type:"smoothstep",
    label:"乘网约车"
  },
  {
    id:"e3-7",
    source:"3",
    target:"7",
    style:{
      stroke:"#e06666"
    },
    type:"smoothstep",
    label:"聚会"
  },
  {
    id:"e3-8",
    source:"3",
    target:"8",
    style:{
      stroke:"#e06666"
    },
    label:"聚会",
    type:"smoothstep"
  },


  // {
  //   id: '1',
  //   type: 'input',
  //   data: {
  //     label: (
  //       <>
  //         Welcome to <strong>React Flow!</strong>
  //       </>
  //     ),
  //   },
  //   position: { x: 250, y: 0 },
  // },
  // {
  //   id: '2',
  //   data: {
  //     label: (
  //       <>
  //         This is a <strong>default node</strong>
  //       </>
  //     ),
  //   },
  //   position: { x: 100, y: 100 },
  // },
  // {
  //   id: '3',
  //   data: {
  //     label: (
  //       <>
  //         This one has a <strong>custom style</strong>
  //       </>
  //     ),
  //   },
  //   position: { x: 400, y: 100 },
  //   style: {
  //     background: '#D6D5E6',
  //     color: '#333',
  //     border: '1px solid #222138',
  //     width: 180,
  //   },
  // },
  // {
  //   id: '4',
  //   position: { x: 250, y: 200 },
  //   data: {
  //     label: 'Another default node',
  //   },
  // },
  // {
  //   id: '5',
  //   data: {
  //     label: 'Node id: 5',
  //   },
  //   position: { x: 250, y: 325 },
  // },
  // {
  //   id: '6',
  //   type: 'output',
  //   data: {
  //     label: (
  //       <>
  //         An <strong>output node</strong>
  //       </>
  //     ),
  //   },
  //   position: { x: 100, y: 480 },
  // },
  // {
  //   id: '7',
  //   type: 'output',
  //   data: { label: 'Another output node' },
  //   position: { x: 400, y: 450 },
  // },
  // { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  // { id: 'e1-3', source: '1', target: '3' },
  // {
  //   id: 'e3-4',
  //   source: '3',
  //   target: '4',
  //   animated: true,
  //   label: 'animated edge',
  // },
  // {
  //   id: 'e4-5',
  //   source: '4',
  //   target: '5',
  //   arrowHeadType: 'arrowclosed',
  //   label: 'edge with arrow head',
  // },
  // {
  //   id: 'e5-6',
  //   source: '5',
  //   target: '6',
  //   type: 'smoothstep',
  //   label: 'smooth step edge',
  // },
  // {
  //   id: 'e5-7',
  //   source: '5',
  //   target: '7',
  //   type: 'step',
  //   style: { stroke: '#f6ab6c' },
  //   label: 'a step edge',
  //   animated: true,
  //   labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  // },
];