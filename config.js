import * as mysql from "mysql2";

import {PICONFIG} from "./pre-init-config.js";


export const CONFIG = {
    HTTP: PICONFIG.HTTP,
    CONN: mysql.createConnection(PICONFIG.MySQL),
    DB: PICONFIG.DB
}