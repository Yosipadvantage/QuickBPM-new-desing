import { ThemeProvider } from "@emotion/react";
import { Button, IconButton, SpeedDialAction, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsBoundingBox } from "react-icons/bs";
import TProcessManagement from "../../modules/configuration/components/TProcessManagement";
import { inputsTheme } from "../../utils/Themes";

interface IButtonHistory {
    idProcedure: number,
    type: number
}


export const SButtonHistory: React.FC<IButtonHistory> = (props: IButtonHistory) => {
    const [showModal, setModal] = useState(false);
    return (
        <>
            <ThemeProvider theme={inputsTheme}>

                <Tooltip className="ml-2 box-s" title="Historico">
                    <Button
                        variant="contained"
                        className="box-s mr-3 mt-2 mb-2"
                        color="secondary"
                        onClick={() => { setModal(true) }}>
                        <BsBoundingBox />
                    </Button>

                </Tooltip>
            </ThemeProvider>

            {showModal && <TProcessManagement dataShow={showModal} id={props.idProcedure} setShow={setModal} type={null} />}
        </>
    )
}