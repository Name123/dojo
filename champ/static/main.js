import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Series from "./series";
import Tournaments from "./tournaments";
 
class Main extends Component {
  render() {
    return (
        <HashRouter>
        <div>
          <h1>The championship</h1>
           <ul className="header">
            <li><NavLink to="/">Tournaments</NavLink></li>
            <li><NavLink to="/series">Series</NavLink></li>
          </ul>
        <div className="content">
           <Route exact path="/" component={Tournaments}/>
           <Route path="/series" component={Series}/>
      </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default Main;