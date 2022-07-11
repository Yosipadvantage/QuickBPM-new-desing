import { ConfigService } from "../core/services/ConfigService";
import {
  TypesCharacterization,
  TypesBusiness,
  TypesProcedure,
} from "../types/Types";
import { Dispatch } from "redux";

const _configService = new ConfigService();

//:::://:::://..:: BUSINESS PROCESS ACTIONS ::..//..//:::://:::://

export const businessCreateOk = (business: any) => ({
  type: TypesBusiness.bussinesOk,
  data: business,
});

export const businessDeleteOk = (id: number) => ({
  type: TypesBusiness.bussinesDeleteOk,
  deletedId: id,
});

export const businessEditOk = (business: any) => ({
  type: TypesBusiness.bussinesEditOk,
  data: business,
});

export const getBusinessProcessCatalog = (idBusinessClass: number | null, idCustomerType: number | null, idCharacterization: number | null) => {
  return async (dispatch: Dispatch) => {
    await _configService
      .getBusinessProcessCatalog(idBusinessClass, idCustomerType, idCharacterization )
      .then((resp: any) => {
        dispatch(listBusinessOk(resp.data.DataBeanProperties.ObjectValue));
      })
      .catch((e) => {
        console.error(e);
      });
  };
};

const listBusinessOk = (business: any) => ({
  type: TypesBusiness.bussinesListOk,
  data: business,
});

//:::://:::://..:: CHARACTERIZATION ACTIONS ::..//..//:::://:::://

export const createCharacterizationOk = (bean: any) => (console.log(bean),
{
  type: TypesCharacterization.characterizationCreateOk,
  data: bean,
}
);

export const characterizationUpdateOk = (bean: any) => (console.log(bean),
{
  type: TypesCharacterization.characterizationEditOk,
  data: bean,
});

export const characterizationDeleteOk = (id: any) => (console.log(id),
{
  type: TypesCharacterization.characterizationDeleteOk,
  deletedId: id,
});

export const getBusinessClassCatalog = () => {
  return (dispatch: Dispatch) => {
    _configService
      .getBusinessClassCatalog()
      .subscribe(resp => {
        console.log(resp);
        dispatch(
          listCharacterizationOk(resp)
        );
      })
  };
};

const listCharacterizationOk = (categorizations: any) => ({
  type: TypesCharacterization.characterizationListOk,
  data: categorizations,
});


//:::://:::://..:: PROCEDURE ACTIONS ::..//..//:::://:::://

export const getProcedureList = (id: number) => {
  return async (dispatch: Dispatch) => {
    await _configService
      .getProcedureList(id)
      .then((resp: any) => {
        dispatch(listProcedureOk(resp.data.DataBeanProperties.ObjectValue));
      })
      .catch((e) => {
        console.error(e);
      });
  };
};

const listProcedureOk = (procedures: any) => ({
  type: TypesProcedure.procedureListOk,
  data: procedures,
});

export const procedureUpdateOk = (newProcedure: any) => ({
  type: TypesProcedure.procedureUpdateOk,
  data: newProcedure
});

export const procedureCreateOk = (newProcedure: any) => ({
  type: TypesProcedure.procedureCreateOk,
  data: newProcedure
});

export const procedureDeleteOk = (id: number) => ({
  type: TypesProcedure.procedureDeleteOk,
  deletedId: id,
});




