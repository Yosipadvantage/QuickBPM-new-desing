import { createTheme, makeStyles } from "@material-ui/core";
import { esES as coreEsEs, esES } from "@mui/material/locale";
import { width } from "@mui/system";
import { Direction } from "react-toastify/dist/utils";

export const inputsTheme = createTheme(
  {
    palette: {
      success: {
        main: "#3E7C17",
      },
      error: {
        main: "#9b241b",
      },
      secondary: {
        main: "#503464",
      },
      primary: {
        main: "#3ba3c6",
      },
      warning: {
        main: "#F7F7F7",
      },
      info: {
        main: "#22577E",
      },
    },
  },
  esES,
  coreEsEs
);

export const useStyles = makeStyles(() => ({
  backdrop: {
    zIndex: 1500,
    // color: '#fff',
  },
  logo: {
    // [theme.breakpoints.down('xl')]: {
    //   width: '40px !important',
    //   height: '50px !important'
    // },
    width: "auto !important",
    height: "auto !important",
    margin: 5,
  },
  field: {
    margin: "0.5rem",
    display: "block",
    color: "#503464",
  },
  button: {
    margin: "0.5rem",
    display: "block",
  },
  root: {
    "& .MuiTableCell-root": { height: "auto", paddingTop: 0, paddingBottom: 0 },
    "& .MuiSpeedDial-root	.directionLeft": { position: "absolute" },
    "& .Mui-disabled .MuiStepIcon-root": { color: "#F2C438" },
    "& .MuiCheckbox-root .MuiSvgIcon-root ": { color: "#503464" },
    "& .MuiSvgIcon-root, .Mui-active": { color: "#503464" },
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: "#503464",
      paddingTop: 20,
      paddingBottom: 20,
      
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    "& .MuiToolbar-root": {
      color: "white",
      backgroundColor: "#503464",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#46005d",
    },
    "& .MuiIconButton-root": {
      margin: "6px",
    },
    "& .MuiIconButton-root:hover": {
      backgroundColor: "#866b99",
      boder: "none",
      outline: "none",
    },
    "& .MuiIconButton-root:focus": {
      backgroundColor: "#transparent",
      border: "none",
      outline: "1px solid #d1cfd1",
    },
    "& .MuiTablePagination-selectLabel": {
      margin: "0",
    },
    "& .MuiTablePagination-displayedRows": {
      margin: "0",
    },
    "& .css-4ahc85-MuiButtonBase-root-MuiIconButton-root": {
      backgroundColor: "transparent",
    },
    "& .css-4ahc85-MuiButtonBase-root-MuiIconButton-root:hover": {
      backgroundColor: "#D6DBDF",
    },
    "& .css-4ahc85-MuiButtonBase-root-MuiIconButton-root:focus": {
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
    },
  },
  tableCell: {
    /* paddingTop: 0,
    paddingBottom: 0 */
  },
}));
