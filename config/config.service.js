import { resolve } from "node:path";
import dotenv from "dotenv";

const envPath = {
  development: ".env.dev",
  production: ".env.prod",
};

dotenv.config({
  path: resolve(`config/${envPath.development}`)
});

export const PORT = process.env.PORT || 5000;
export const DB_URI = process.env.DB_URI;
export const SALT = process.env.SALT || 10;
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
export const REDIS_URI = process.env.REDIS_URI;

export const Token_Access_User_Key = process.env.Token_Access_User_Key;
export const Token_Refresh_User_Key = process.env.Token_Refresh_User_Key;

export const Token_Access_Admin_Key = process.env.Token_Access_Admin_Key;
export const Token_Refresh_Admin_Key = process.env.Token_Refresh_Admin_Key;

export const Refresh_EXPIRATION = Number(process.env.Refresh_EXPIRATION) ; 
export const Access_EXPIRATION = Number(process.env.Access_EXPIRATION) ; 
// SOCIAL LOGINS
export const CLIENT_ID = process.env.CLIENT_ID;


// sending email
export const USER_EMAIL = process.env.USER_EMAIL;
export const USER_PASSWORD = process.env.USER_PASSWORD;



// whitelisting urls
export const WHITE_LIST= process.env.White_List;
