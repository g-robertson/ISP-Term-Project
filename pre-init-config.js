import {dbuser} from "./dbuser.js";
import {dbpassword} from "./dbpassword.js";

export const PICONFIG = {
    HTTP: {
        host: "localhost",
        port: 8080
    },

    MySQL:  {
        host: "localhost",
        user: dbuser,
        password: dbpassword
    },

    DB: "myDBISPTERMPROJECT"
};