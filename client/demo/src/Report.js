import React from 'react';
import Head from './Header';
import {Row, Col, Card} from "antd";
import "./Report.css";

class Report extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return (
            <div id="report">
                <Head />
                <Row id="canvasbelow">
                   <Col id="left">
                        <Card id="basicinfo" title="基本信息">
                            

                        </Card>                   
                   </Col>
                   <Col  id="right"></Col>
                </Row>
            </div>
        )
    }
}

export default Report;