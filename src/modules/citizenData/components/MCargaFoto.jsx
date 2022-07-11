import React, { Dispatch, FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsXSquare } from "react-icons/bs";


// interface Props {
//   show: boolean;
//   setShow: Dispatch<boolean>;
// }


export const MCargaFoto = ({ show, setShow, shoot ,user,view,face  }) => {
  const [picture, setPicture] = useState();
  
  const mostrar = (e) => {
    const archivo = document.querySelector("#file")?.files[0];
    console.log("archivo recibido", archivo);
    const reader = new FileReader();
    if (archivo) {
      reader.readAsDataURL(archivo);
      reader.onloadend = function () {
        setPicture(reader.result);
        console.log(picture)
      };
    }
    
  };

  return (
    <div>
      <Modal size="lg" show={show}  centered  onHide={()=>setShow(false)}>
        <Modal.Header>
          <div className="title-modal">Cargue de Foto</div>
          <BsXSquare
            className="pointer"
            onClick={() => {
              setShow(false);
            }}
          />
        </Modal.Header>
        <div className="container uploadImage">
          <img
            id="img"
            alt=""
            src={picture}
            style={{ width: "300px", height: "300px" }}
          />
          <input type="file" id="file" onChange={() => mostrar()} />
          <input
            type="submit"
            className="btn btn-success"
            style={{ width: "250px", marginBottom: "5rem" }}
            onClick={()=>{
              console.log('cara',face)
              console.log('user',user)
              console.log('view',view)
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
