import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { inputsTheme } from "../../utils/Themes";

export const RegisterCall = () => {
  return (
    <>
      <div className="nWhite p-3 m-3 w-80">
        <div className="px-5 mt-5 card box-s container">
          <form>
            <Row className="mt-5 d-flex justify-content-center">
              
              <Col sm={12} className="mt-5 mb-5">
                <fieldset>
                  <legend>Descripcion del Ticket</legend>
                  <TextField
                    size="small"
                    color="secondary"
                    id="description"
                    label="Descripción del motivo"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={5}
                  />
                </fieldset>
              </Col>
              <Col sm={9} className="mb-5 d-flex justify-content-center">
                <ThemeProvider theme={inputsTheme}>
                  <Button
                    className="w-100"
                    variant="contained"
                    color="secondary"
                    // onClick={() => {
                    // //   setMsg({
                    // //     mensaje: "EL PERMISO NO HA SIDO ASGINADO AÚN",
                    // //   });
                    // }}
                  >
                    REGISTRAR TICKET
                  </Button>
                </ThemeProvider>
              </Col>
            </Row>
          </form>
        </div>
      </div>
      {/* {spinner && <SSpinner show={spinner} />}
      {confirmAction && (
        <GenericConfirmAction
          show={confirmAction}
          setShow={setConfirmAction}
          confirmAction={deleteElement}
          title={"¿Está seguro de realizar el registro?"}
        />
      )} */}
    </>
  );
};
