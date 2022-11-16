import logo from "./logo.svg";
import React, { Suspense } from "react";
import "./App.css";
import Login from "./Component/login";
import Register from "./Component/register";
import { createBrowserHistory } from "history";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import urls from "./helpers/urls.js";
import PageNotFound from "./Component/PageNotFound";
import MainPage from "./Component/mainPage";
function App() {
  const History = createBrowserHistory();
  const isUserIsAuthenticated = () => {
    return sessionStorage.getItem("JWTtoken") ? true : false;
  };
  return (
    <>
      <Suspense fallback={null}>
        <div className="theme-light ltr-support">
          <Router history={History}>
            <div>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => {
                    return isUserIsAuthenticated() ? (
                      <Redirect to={urls.mainScreen} />
                    ) : (
                      <Login {...props} />
                    );
                  }}
                />
                <Route
                  path={urls.login}
                  exact
                  render={(props) => {
                    return isUserIsAuthenticated() ? (
                      <Redirect to={urls.mainScreen} />
                    ) : (
                      <Login {...props} />
                    );
                  }}
                />
                <Route
                  path={urls.register}
                  exact
                  render={(props) => {
                    return isUserIsAuthenticated() ? (
                      <Redirect to={urls.mainScreen} />
                    ) : (
                      <Register {...props} />
                    );
                  }}
                />
                <Route
                  path={urls.mainScreen}
                  exact
                  render={(props) => {
                    return isUserIsAuthenticated() ? (
                      <MainPage {...props} />
                    ) : (
                      // <MainPage {...props} />
                      <Redirect to={urls.login} />
                    );
                  }}
                />

                <Route
                  path="*"
                  render={() => {
                    return <PageNotFound />;
                  }}
                />
              </Switch>
            </div>
          </Router>
        </div>
      </Suspense>
    </>
  );
}

export default App;
