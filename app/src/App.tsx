import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Authentication from './views/Authentication';
import Main from './views/Main';
import Registration from './views/Registration';
import UserSignOut from './components/UserSignOut';

function App() {

    return (
        <Switch>
            <Route path="/sign-in" component={Authentication}/>
            <Route path="/sign-up" component={Registration}/>
            <Route path="/sign-out" component={UserSignOut}/>
            <ProtectedRoute path="/" exact component={Main}/>
            <Redirect to="/"/>
        </Switch>
    );
}

export default App;
