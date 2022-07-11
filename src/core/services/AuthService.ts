import http from "../http-common";

export class AuthService {

    private url = '/jsserver';

    login(email: string, password: string) {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "com.advantage.bean.account.WorkSession_loguinUsuarioWS_String_String",
            ArgumentList: [
                email,
                password,
            ]
        }
        const data = JSON.stringify(parametros);
        return http.post(this.url, data);
    }
}