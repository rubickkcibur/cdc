import React, { useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  removeElements,
  addEdge,
  Elements,
  Connection,
  Edge,
  OnLoadParams,
  MiniMap,
  Background
} from 'react-flow-renderer';

import Controls from './Controls';
import initialElements from './initial-elements';
// import './save.css';


const SaveRestore = () => {
  const [rfInstance, setRfInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));
  const onLoad = (reactFlowInstance:any) => {
    setRfInstance(reactFlowInstance)
    reactFlowInstance.fitView();
  };

  return (
    <ReactFlowProvider>
      <Controls rfInstance={rfInstance} setElements={setElements} />
      <ReactFlow 
        elements={elements} 
        onElementsRemove={onElementsRemove} 
        onConnect={onConnect} 
        onLoad={onLoad} 
        snapToGrid={true}
        snapGrid={[15, 15]}
        >
          <MiniMap
            nodeStrokeColor={(n:any) => {
              if (n.style?.background) return n.style.background;
              if (n.type === 'input') return '#0041d0';
              if (n.type === 'output') return '#ff0072';
              if (n.type === 'default') return '#1a192b';
              return '#eee';
            }}
            nodeColor={(n:any) => {
              if (n.style?.background) return n.style.background;
              return '#fff';
            }}
            nodeBorderRadius={2}
          />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default SaveRestore;