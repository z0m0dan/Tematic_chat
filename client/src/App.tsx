import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Index from "./pages/login";
import Dashboard from "./pages/dashboard";
import Register from "./pages/register";
const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
