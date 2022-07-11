import { Backdrop, Typography } from '@mui/material'
import React from 'react'
import { useStyles } from '../../utils/Themes';
;


interface ISSpinner {
    show: boolean
    message?: string | null
}


export const SSpinner: React.FC<ISSpinner> = (props: ISSpinner) => {

    const classes = useStyles();

    const Animation = () => {
        return (
            <div style={{ position: 'fixed', textAlign: 'center' }}>
                <img className={classes["logo"]} alt="spinner" src={process.env.PUBLIC_URL + "/assets/logodccae_192_192.png"} />
                <Typography style={{ fontSize: '40px', color: '#fff' }}>{props.message? props.message : 'DCCAE'}</Typography>
                <div className="spinnerCustom" >
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Backdrop className={classes.backdrop} open={props.show}>
                <Animation />
            </Backdrop>
        </>
    )
}