import "bootswatch/dist/darkly/bootstrap.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import { IEspecialidad } from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

interface IEspecialidadesJSON {
    especialidades: IEspecialidad[];
}

// tslint:disable-next-line:no-var-requires
const json: IEspecialidadesJSON = require("./especialidades.json");
json.especialidades.sort((a, b) => a.descripcion.localeCompare(b.descripcion));

ReactDOM.render(
    <App especialidades={json.especialidades} />,
    document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
