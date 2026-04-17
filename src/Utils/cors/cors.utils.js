// import {  White_List } from "../../../config/config.service.js";
import { WHITE_LIST} from "../../../config/config.service.js";
import { badRequestException } from "../Response/error.response.js";


export function corsOptions() {
    const whiteList = WHITE_LIST.split(",");
   const corsOptions = {
    origin: function (origin, callback) {
        if(whiteList.includes(origin)){
            callback(null, true);
        }else if(!origin){
            callback(null, true);
        }else{
            callback(badRequestException("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        }
    return corsOptions;
}

