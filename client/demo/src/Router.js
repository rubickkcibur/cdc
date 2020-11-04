import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Report from './Report';
import Overview from './Overview';

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/report" component={Report}/>
            <Route exact path="/overview" component={Overview}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;