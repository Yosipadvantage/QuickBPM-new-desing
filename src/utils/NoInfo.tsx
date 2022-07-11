import React from 'react'

export const NoInfo: React.FC = () => {
    return (
        <div className="mt-5 d-flex justify-content-center align-items-center aling-column">
            <img className="img-fluid" src={process.env.PUBLIC_URL + "/assets/No-info.png"} style={{maxWidth:500,maxHeight:500, objectFit:'cover'}} alt="No hay infomación para mostrar" />
            <h1>No existe información</h1>
        </div>
    )
}

