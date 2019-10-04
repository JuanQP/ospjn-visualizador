import { faCodeBranch, faExternalLinkAlt, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import {
  Map,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import Select from "react-select";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";

interface IPrestador {
  nombre: string;
  domicilio: string;
  domicilio_completo: string;
  telefonos: string;
  posicion: [number, number];
}

export interface IEspecialidad {
  descripcion: string;
  prestadores: IPrestador[];
}

interface IAppProps extends React.ClassAttributes<App> {
  especialidades: IEspecialidad[];
  posicion_inicial: [number, number];
}

interface IAppState extends React.ClassAttributes<App> {
  modal: boolean;
  select2_value: Array<{value: string, label: string}>;
  select2_options: Array<{value: string, label: string}>;
}

class App extends React.Component<IAppProps, IAppState> {
  public static defaultProps = {
    especialidades: [],
    posicion_inicial: [-34.6177322, -58.4540829],
  };

  constructor(props: IAppProps) {
    super(props);
    const {especialidades} = this.props;
    this.state = {
      modal: false,
      select2_options: especialidades.map((e, i) => ({
        label: e.descripcion,
        value: i.toString(),
      })),
      select2_value: [],
    };
    this.handleEspecialidadChange = this.handleEspecialidadChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  public render() {
    const {
      posicion_inicial,
      especialidades,
    } = this.props;
    const {
      select2_options,
      select2_value,
    } = this.state;

    const select2Values = select2_value.map((s) => s.value);
    const especialidadesSeleccionadas = especialidades.filter(
      (_, i) => select2Values.includes(i.toString()),
    );

    const customStyles = {
      option: (styles: any, {isFocused}: {isFocused: boolean}) => {
        return {
          ...styles,
          backgroundColor: isFocused ? "gray" : "#222",
        };
      },
    };

    return (
      <Container>
        <Navbar color="light" light={true} expand="md">
          <NavbarBrand href="/">OSPJN Visualizador</NavbarBrand>
            <Nav className="ml-auto" navbar={true}>
              <NavItem>
                <NavLink
                  tag={Button}
                  outline={true}
                  color={"primary"}
                  target="_blank"
                  href="https://www.ospjn.gov.ar/web/"
                >
                  Web de OSPJN{" "}<FontAwesomeIcon icon={faExternalLinkAlt} />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={Button}
                  outline={true}
                  color={"success"}
                  target="_blank"
                  href="https://github.com/JuanQP/ospjn-visualizador"
                >
                  GitHub{" "}<FontAwesomeIcon icon={faCodeBranch} />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={Button}
                  outline={true}
                  color={"info"}
                  href="#"
                  onClick={this.toggle}
                >
                  Acerca De{" "}<FontAwesomeIcon icon={faInfo} />
                </NavLink>
              </NavItem>
            </Nav>
        </Navbar>
        <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg">
          <ModalHeader toggle={this.toggle}>Acerca de esta página</ModalHeader>
          <ModalBody>
            <p className="lead">Esta página fue realizada para poder visualizar de forma más amigable los prestadores de servicio de la OSPJN</p>
            <p className="lead">La información que presenta la página oficial sobre las direcciones es poco útil cuando uno no tiene un mapa a mano. Esta página utiliza la misma información que la página oficial, pero la presenta de una forma distinta, con marcadores en un mapa, de esta forma es posible usar información de manera más inteligente (por ejemplo comparar distancia al trabajo o a nuestras casas, cosas que son muy difíciles de ver en una lista de direcciones).</p>
            <p className="lead">Última revisión de la información de los prestadores: <kbd>04/10/2019</kbd></p>
          </ModalBody>
        </Modal>
        <Row>
          <Col>
          <Form>
            <FormGroup style={{zIndex: 401}}>
              <Label>Especialidad</Label>
              <Select
                options={select2_options}
                value={select2_value}
                isMulti={true}
                onChange={this.handleEspecialidadChange}
                styles={customStyles}
              />
            </FormGroup>
          </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Map
              center={posicion_inicial}
              zoom={12}
              style={{height: "700px", width: "100%"}}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              />
              {especialidadesSeleccionadas.map(this.marcadores_especialidad)}
            </Map>
          </Col>
        </Row>
      </Container>
    );
  }

  private toggle(): void {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  private marcadores_especialidad(especialidad: IEspecialidad): JSX.Element[] {
    return (especialidad.prestadores.map((p) => (
      <Marker position={p.posicion}>
        <Popup>
          Especialidad: <strong>{especialidad.descripcion}</strong><br />
          Nombre: <strong>{p.nombre}</strong><br />
          Domicilio: <strong>{p.domicilio_completo}</strong><br />
          Teléfonos: <strong>{p.telefonos}</strong>
        </Popup>
      </Marker>
    )));
  }

  private handleEspecialidadChange(e: Array<{value: string, label: string}>): void {
    this.setState((prevState) => ({
      select2_value: e == null ? [] : e,
    }));
  }
}

export default App;
