import { env } from "../../env";
import { map, Observable } from "rxjs";
import api from "../settings/api";

export class FileService {

    private baseURL = env.REACT_APP_ENDPOINT;
    private url = "/jsserver";

    public getUrlFile(contextMedia: string, media: string): string {
        let url = "";
        console.log(this.baseURL);
        if(contextMedia && media) {
            url = this.baseURL+"//filedownload?ContextMedia@="+contextMedia+"@@Media@="+media;    
        }
        console.log(url);
        return url;
    }

    public imagenToBase64(context: any, media: any): Observable<any> {
        const parametros = {
            ServiceName: "ArmasService",
            MethodHash: "java.util.Map_imagenToBase64_Number_String_String",
            ArgumentList: [
                null,
                context,
                media
            ],
        };
        const data = JSON.stringify(parametros);
        return api.post(this.url, data);
    }

    /* "http://190.146.64.16:81/dcca/filedownload?ContextMedia@=temp@@Media@=2021-12-09_110648_1339022546.pdf" */
}