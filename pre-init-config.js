import {dbpassword} from "./dbpassword.js"

export const PICONFIG = {
    HTTP: {
        host: "localhost",
        port: 8080
    },

    MySQL:  {
        host: "localhost",
        user: "root",
        password: dbpassword,
        db: "myDBISPTERMPROJECT"
    }
};