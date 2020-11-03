import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import NovoCriterio from './pages/NovoCriterio';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/novo-criterio" component={NovoCriterio} />
            </Switch>
        </BrowserRouter>
    )
}
