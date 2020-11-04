import React from 'react';
import Header from './Header';

class Overview extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return (
            <div id="overview">
                <Header />
            </div>
        )
    }
}

export default Overview;