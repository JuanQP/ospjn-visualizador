import * as React from "react";
import {
  Map,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import Select from "react-select";
import {
  Col,
  Container,
  Form,
  FormGroup,
  Label,
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

interface IEspecialidad {
  descripcion: string;
  prestadores: IPrestador[];
}

interface IAppProps extends React.ClassAttributes<App> {
  especialidades: IEspecialidad[];
  posicion_inicial: [number, number];
}

interface IAppState extends React.ClassAttributes<App> {
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
      select2_options: especialidades.map((e, i) => ({
        label: e.descripcion,
        value: i.toString(),
      })),
      select2_value: [],
    };
    this.handleEspecialidadChange = this.handleEspecialidadChange.bind(this);
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
                <NavLink href="https://www.ospjn.gov.ar/web/">Página de OSPJN</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/JuanQP/ospjn-visualizador">GitHub</NavLink>
              </NavItem>
            </Nav>
        </Navbar>
        <Row>
          <Col>
          <p>
            Visualizador de Prestadores de Servicios del OSPJN hecho <em>un poquito mejor.</em>
          </p>
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
