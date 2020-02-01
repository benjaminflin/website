import "web-animations-js";
import React from "react";
import { hydrate, render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducer";
import App from "./App";
import "./index.css";

const store = createStore(reducer);

const rootElement = document.getElementById("root");

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

if (rootElement.hasChildNodes()) {
  hydrate(app, rootElement);
} else {
  render(app, rootElement);
}
