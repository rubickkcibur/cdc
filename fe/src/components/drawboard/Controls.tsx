import React, { memo, useCallback, Dispatch, FC, useEffect } from 'react';
import { useZoomPanHelper, OnLoadParams, Elements, FlowExportObject } from 'react-flow-renderer';
import { Button, Col, Row } from 'antd';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../lib/store';
import { ActSetState } from '../../lib/state/global';


const getNodeId = () => `randomnode_${+new Date()}`;

type ControlsProps = {
  rfInstance?: OnLoadParams;
  setElements: Dispatch<React.SetStateAction<Elements<any>>>;
};

const Controls: FC<ControlsProps> = ({ rfInstance, setElements }) => {
  const { transform } = useZoomPanHelper();
  const dispatch = useDispatch()
  const rf = useTypedSelector(e=>e.PAGlobalReducer.rfIns)

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      dispatch(ActSetState({rfIns:flow}))
      // console.log(flow)
      // localforage.setItem(flowKey, flow);
      // console.log("so why")
    }
  }, [rfInstance]);

  useEffect(()=>{
    console.log("global rf")
    console.log(rf)
  },[rf])

  // const onRestore = useCallback(() => {
  //   const restoreFlow = async () => {
  //     // const flow: FlowExportObject | null = await localforage.getItem(flowKey);

  //     if (rf) {
  //       const [x = 0, y = 0] = rf.position;
  //       setElements(rf.elements || []);
  //       transform({ x, y, zoom: rf.zoom || 0 });
  //     }else{
  //       console.log(rf)
  //       console.log("nothing on restore")
  //     }
  //   };
  //   restoreFlow();
  // }, [setElements, transform]);
  const onRestore=()=>{
    if (rf) {
      const [x = 0, y = 0] = rf.position;
      setElements(rf.elements || []);
      transform({ x, y, zoom: rf.zoom || 0 });
    }else{
      console.log(rf)
      console.log("nothing on restore")
    }
  }

  // useEffect(()=>{
  //   const restoreFlow = async () => {
  //     // const flow: FlowExportObject | null = await localforage.getItem(flowKey);

  //     if (rf) {
  //       const [x = 0, y = 0] = rf.position;
  //       setElements(rf.elements || []);
  //       transform({ x, y, zoom: rf.zoom || 0 });
  //     }
  //   };

  //   restoreFlow();
  // },[rfInstance])

  const onAdd = useCallback(() => {
    const newNode = {
      id: `random_node-${getNodeId()}`,
      data: { label: '新增病例' },
      position: { x: Math.random() * window.innerWidth - 100, y: Math.random() * window.innerHeight },
      style:
      {
        background:"#e06666",
        color:"#FFF"
      }
    };
    setElements((els) => els.concat(newNode));
  }, [setElements]);

  return (
    <div >
      <Row>
        <Col span={24}>
        <Button onClick={onSave}>保存</Button>
        <Button onClick={onRestore}>撤销</Button>
        <Button onClick={onAdd}>添加患者</Button>
        </Col>
      </Row>
    </div>
  );
};

export default memo(Controls);


