//Global reducer. Here u can found all Config's module reducers.
import {
  TypesCharacterization,
  TypesBusiness,
  TypesProcedure,
  TypesItems,
  TypesNameApp,
  TypesPermiso,
} from "../types/Types";

//:::://:::://..:: STATES ::..//..//:::://:::://

const CharacterizationState = {
  characterizations: [],
  error: null,
  loading: false,
  deletedId: null,
  characterizationEdit: null,
};

const BusinessState = {
  business: [],
  error: null,
  loading: false,
  deleteId: null,
  businessEdit: null,
};

const ProcedureState = {
  procedures: [],
  error: null,
  loading: false,
  deleteId: null,
  procedureEdit: null,
};

//:::://:::://..:: REDUCERS ::..//..//:::://:::://

export const CharacterizationsReducer = (
  state = CharacterizationState,
  action: any
) => {
  switch (action.type) {
    case TypesCharacterization.characterizationList:
    case TypesCharacterization.characterizationCreate:
      return {
        ...state,
        loading: action.payload,
      };
    case TypesCharacterization.characterizationListOk:
      return {
        ...state,
        loading: false,
        error: null,
        characterizations: action.data,
      };
    case TypesCharacterization.characterizationCreateOk:
      return {
        ...state,
        loading: false,
        error: null,
        characterizations: [...state.characterizations, action.data],
      };
    case TypesCharacterization.characterizationDelete:
      return {
        ...state,
        loading: true,
        deleteId: action.data,
      };
    case TypesCharacterization.characterizationDeleteOk:
      return {
        ...state,
        characterizations: state.characterizations.filter(
          (i: any) => i.IDBusinessClass !== action.deletedId
        ),
        deleteId: null,
      };
    case TypesCharacterization.characterizationEdit:
      return {
        ...state,
        characterizationEdit: action.data,
      };
    case TypesCharacterization.characterizationEditOk:
      return {
        ...state,
        characterizationEdit: state.characterizations.map((cat: any) =>
          cat.IDBusinessClass ===
            action.data.IDBusinessClass
            ? (cat = action.data)
            : cat
        ),
      };

    default:
      return state;
  }
};

export const BusinessReducer = (state = BusinessState, action: any) => {
  switch (action.type) {
    case TypesBusiness.bussinesList:
    case TypesBusiness.bussinesCreate:
      return {
        ...state,
        loading: true,
      };
    case TypesBusiness.bussinesOk:
      return {
        ...state,
        loading: false,
        business: [...state.business, action.data],
      };
    case TypesBusiness.bussinesEditCancel:
    case TypesBusiness.bussinesListCancel:
    case TypesBusiness.bussinesCancel:
      return {
        ...state,
        loading: false,
        error: action.data,
      };

    case TypesBusiness.bussinesListOk:
      return {
        ...state,
        loading: false,
        error: null,
        business: action.data,
      };

    case TypesBusiness.bussinesDelete:
      return {
        ...state,
        deleteId: action.data,
      };

    case TypesBusiness.bussinesDeleteOk:
      return {
        ...state,
        business: state.business.filter(
          (item: any) =>
            item.DataBeanProperties.IDBusinessProcess !== action.deletedId
        ),
        deleteId: null,
      };

    case TypesBusiness.bussinesEdit:
      return {
        ...state,
        businessEdit: action.data,
      };

    case TypesBusiness.bussinesEditOk:
      return {
        ...state,
        businessEdit: null,
        business: state.business.map((business: any) =>
          business.DataBeanProperties.IDBusinessProcess ===
            action.data.DataBeanProperties.IDBusinessProcess
            ? (business = action.data)
            : business
        ),
      };

    default:
      return state;
  }
};

export const ProcedureReducer = (state = ProcedureState, action: any) => {
  switch (action.type) {
    case TypesProcedure.procedureList:
    case TypesProcedure.procedureCreate:
      return {
        ...state,
        loading: true,
      };
    case TypesProcedure.procedureUpdateOk:
      return {
        ...state,
        loading: false,
        procedureEdit: null,
        procedures: state.procedures.map((procedure: any) =>
          procedure.DataBeanProperties.IDProcedure === action.data.DataBeanProperties.IDProcedure
            ? (procedure = action.data)
            : (procedure)
        )
      };
    case TypesProcedure.procedureCreateOk:
      return {
        ...state,
        loading: false,
        procedures: [...state.procedures, action.data], 

      };
    case TypesProcedure.procedureUpdateCancel:
    case TypesProcedure.procedureCreateCancel:
    case TypesProcedure.procedureListCancel:
      return {
        ...state,
        loading: false,
        error: action.data,
      };

    case TypesProcedure.procedureListOk:
      return {
        ...state,
        loading: false,
        error: null,
        procedures: action.data,
      };

    case TypesProcedure.procedureDelete:
      return {
        ...state,
        loading: true,
        deleteId: action.data,
      };
    case TypesProcedure.procedureDeleteOk:
      return {
        ...state,
        procedures: state.procedures.filter(
          (ui: any) => ui.DataBeanProperties.IDProcedure !== action.deletedId
        ),
        deleteId: null,
      };
    default:
      return state;
  }
};


const InitItemPerPage = {
  items: 0
}
const InitAppName = {
  name: ''
}
const InitPermiso = {
  permiso: false
}


export const ItemsPerPageReducer = (state = InitItemPerPage, action: any) => {
  console.log(action.type);
  switch (action.type) {

    case TypesItems.itemsPerpage:

      return {
        //...state,
        // state.items = action.data,
        items: action.data
      }

    default:
      return state;
  }
}
export const AppNameReducer = (state = InitAppName, action: any) => {
  switch (action.type) {

    case TypesNameApp.appName:
      return {
        //...state,
        // state.items = action.data,
        name: action.data
      }

    default:
      return state;
  }
};
export const PermisoReducer = (state = InitAppName, action: any) => {
  switch (action.type) {

    case TypesPermiso.statusPermiso:
      return {
        //...state,
        // state.items = action.data,
        permiso: action.data
      }

    default:
      return state;
  }
};

// export const SetItemPerPage = (valor: number) => {
//   return {
//     type: "SetItemPerPage",
//     items: valor
//   }
// }