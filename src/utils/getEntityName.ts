import { User } from "../shared/model/User";

export const getEntityName = (user: User) => {
  return (
    (user.Surname1 || "") +
    " " +
    (user.Surname2 || "") +
    " " +
    (user.Name1 || "") +
    " " +
    (user.Name2 || "")
  );
};
