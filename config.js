import * as mysql from "mysql";

import {PICONFIG} from "./pre-init-config.js";


export const CONFIG = {
    HTTP: PICONFIG.HTTP,
    CONN: mysql.createConnection(PICONFIG.MySQL)
}