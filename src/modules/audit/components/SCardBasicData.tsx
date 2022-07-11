import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FileService } from '../../../core/services/FileService';
import { GlobalService } from '../../../core/services/GlobalService';
import { User } from '../../../shared/model/User'
import { Toast } from '../../../utils/Toastify';
import { IPersonPhotoData } from '../../citizenData/model/PersonPhotoData';

interface ISCardBasicData {
    idAccount: number,
    setSpinner: Function
}
const _globalService = new GlobalService();
const _fileService = new FileService();

const FACE = 6;

export const SCardBasicData: React.FC<ISCardBasicData> = (props: ISCardBasicData) => {

    const [user, setUser] = useState<User>();
    const [personPhoto, setPersonPhoto] = useState('');

    useEffect(() => {
        getPersonPhotoDataByAccount(props.idAccount);
        getAccountByIDAccount(props.idAccount);
    }, [])


    const getAccountByIDAccount = (id: number) => {
        props.setSpinner(true);
        _globalService.getAccountByIDAccount(id).subscribe(resp => {
            props.setSpinner(false);
            console.log(resp);
            if (resp.DataBeanProperties.ObjectValue) {
                setUser(resp.DataBeanProperties.ObjectValue.DataBeanProperties);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "No se ha generado la información",
                });
            }
        });
    };

    const getPersonPhotoDataByAccount = (idAccount: number) => {
        props.setSpinner(true);
        let aux: any[] = [];
        _globalService
            .getPersonPhotoDataCatalog(idAccount)
            .subscribe(resp => {
                props.setSpinner(false);
                if (resp.length > 0) {
                    resp.map((data: IPersonPhotoData) => {
                        if (data.SideType === FACE) {
                            aux[data.ViewType] = data;
                        }
                    })
                    setPersonPhoto(_fileService.getUrlFile(aux[0].Context, aux[0].Filename));
                }
            })
    };

    return (
        <>
            <div className="card-basic-data">
                <Row>
                    <Col sm={4} style={{ height: 150 }}>
                        <div
                            style={{
                                width: "100%",
                                maxHeight: "250px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <div
                                className="mt-3"
                                style={{
                                    maxWidth: 150,
                                }}
                            >
                                <img
                                    className="img-fluid"
                                    src={
                                        personPhoto !== ''
                                            ? personPhoto
                                            : process.env.PUBLIC_URL +
                                            "/assets/img_avatar.png"
                                    }
                                    style={{
                                        objectFit: "cover",
                                        height: 125,
                                        borderRadius: '100%'
                                    }}
                                    alt="Profile Img"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col sm={8} className="items-basic-data">
                        <span>
                            <b>DATOS PERSONALES</b>
                        </span>
                        <div className="mt-3">
                            <div className="text-basic-data">
                                Identificación: {user?.Nit}
                            </div>
                            <div className="text-basic-data">
                                Nombre: {user?.EntityName}
                            </div>
                            <div className="text-basic-data">
                                Correo: {user?.eMail}
                            </div>
                            <div className="text-basic-data">Celular: {user?.Tel}</div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}
