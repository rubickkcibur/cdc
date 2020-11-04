import React from 'react';
import Header from './Header';

class Report extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return (
            <div id="report">
                <Header />
            </div>
        )
    }
}

export default Report;