import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

// If using Cordova, comment out the line above and activate the lines below:

// function startApp() {
// 	ReactDOM.render(<App />, document.getElementById("root"));
// }

// if ((window as any).cordova) {
// 	document.addEventListener("deviceready", startApp, false);
// } else {
// 	startApp();
// }
