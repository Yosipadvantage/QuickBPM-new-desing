import { Button, IconButton, InputAdornment, TextField, ThemeProvider } from '@mui/material';
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import SSearchPerson from '../../../shared/components/SSearchPerson';
import { inputsTheme } from '../../../utils/Themes';

interface IHomologacionArmas {

}

export const HomologacionArmas: React.FC<IHomologacionArmas> = (props: IHomologacionArmas) => {

    const [nameUser, setNameUser] = useState("");
    const [user, setUser] = useState("");
    const [showUser, setShowUser] = useState(false);
    const [render, setRender] = useState(0);


    const getItem = (data: any) => {
        console.log(data);
        setUser(data);
        setNameUser(data.EntityName);
    };

    const onNext = () => {

    }

    const renderSwitch = () => {
        switch (render) {
            case 0: return (
                <div className="container d-flex justify-content-center mt-15">
                    <form>
                        <Row className="card box-s m-3 d-block">
                            <Col sm={12} className="mt-5 mb-5 mr-5 ml-5">
                                <h1>CONSULTAR USUARIO</h1>
                            </Col>
                            <Col sm={12} className="mt-3 mb-3">
                                <TextField
                                    size="small"
                                    value={nameUser}
                                    label=".:Usuario:. *"
                                    fullWidth
                                    color="secondary"
                                    id="distributionChanel"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowUser(true)}>
                                                    <BsSearch />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onClick={() => setShowUser(true)}
                                />
                            </Col>
                            <Col sm={12} className="mb-3 d-flex justify-content-center">
                                <ThemeProvider theme={inputsTheme}>
                                    <Button
                                        className=" mt-3 w-100"
                                        variant="contained"
                                        color="secondary"
                                        onClick={(e) => {
                                            onNext();
                                        }}
                                    >
                                        SIGUIENTE
                                    </Button>
                                </ThemeProvider>
                            </Col>
                        </Row>
                    </form>
                </div>
            )

            default:
                break;
        }
    };

    return (
        <>
            <div className="nWhite w-80 p-3 m-3">
                <main>
                    {renderSwitch()}
                </main>
            </div>
            {showUser && (
                <SSearchPerson
                    getShow={setShowUser}
                    getPerson={getItem}
                    dataShow={showUser}
                    create={false}
                />
            )}
        </>
    )
}
