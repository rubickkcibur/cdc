import React from 'react';
import Head from './Header';
import {Row, Col} from "antd";

class Overview extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return (
            <div id="overview">
                <Head />
                <Row >
                    
                </Row>
            </div>
        )
    }
}

export default Overview;