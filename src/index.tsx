import "bootswatch/dist/darkly/bootstrap.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

// tslint:disable-next-line:no-var-requires
const json = require("./especialidades.json");

ReactDOM.render(
    <App especialidades={json.especialidades} />,
    document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
