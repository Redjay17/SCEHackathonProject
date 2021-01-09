import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import GameRoom from "./GameRoom/GameRoom";

const RouterComp = () => {
    return (
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:roomId" component={GameRoom} />
          </Switch>
        </Router>
      );
}

export default RouterComp;