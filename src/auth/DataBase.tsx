import React, { useEffect, useState } from 'react'
import { AdminService } from '../core/services/AdminService';
import { SLoadDocument } from '../shared/components/SLoadDocument'
const _adminService = new AdminService();

export const DataBase = () => {
    const [show, setShow] = useState(false);
    const [media, setMedia] = useState("");
    const [context, setContex] = useState("");
    const [beanDoc, setBeanDoc] = useState<any>();
    const [resp, setResp] = useState<any>();



    const setShowF = (show: boolean) => {
        setShow(show);
    }
    const getMedia = (doc: any) => {
        setMedia(doc.Media);
        setContex(doc.MediaContext);
        setBeanDoc(doc);

    };

    const ejecutar = () => {
        let resp2 = '';
        _adminService.Report_executeSQL(media, context).subscribe((resp: any) => {
            resp2 = JSON.stringify(resp, undefined, 2);
            console.log(resp2);

            setResp(resp2);

        })
    }
    const download = () => {
        let resp2 = '';
        _adminService.exportDataBase().subscribe((resp: any) => {
            resp2 = JSON.stringify(resp, undefined, 2);
            console.log(resp2);

            setResp(resp2);

        })
    }
    useEffect(() => {
        console.log(resp);

    }, [resp]);

    return (
        <div className='row'>
            <div className='container mt-5 col-md-6 d-flex flex-wrap flex-row justify-content-center'><h5 className="w-100 text-center">Subir base de datos</h5>
                <div className='d-flex '>

                    <button className='btn btn-outline-success m-1' onClick={() => setShowF(true)}>Cargar DataBase</button>
                    {beanDoc ?
                        <div> {beanDoc?.TypeName === 'SQL' || beanDoc?.TypeName === 'Sql' || beanDoc?.TypeName === 'sql' ? <button className='btn btn-outline-success m-1' onClick={() => ejecutar()}>Ejecutar Sql</button> : '*Archivo no valido, archivos soportados:  .sql .Sql .SQL'}
                        </div> : ''}

                </div>
            </div>

            {show && <SLoadDocument setShow={setShowF} type={1} show={show} title={'Cargar base de datos'} getMedia={getMedia} beanAction={null} accept={[".sql"]} />}
            <hr />
            <div className='container mt-5 col-md-6 d-flex flex-wrap flex-row justify-content-center'>
                <h5 className='w-100 text-center'>
                    Descargar base de datos
                </h5>
                <div className='' >
                    <button className='btn btn-outline-success m-1' onClick={() => download()}>descargar DataBase</button>
                </div>
            </div>
            <div className='container mt-5 col-md-6'>
                <textarea disabled className='form-control w-100' rows={30} value={resp}>
                </textarea>
            </div>
        </div>
    )
}
