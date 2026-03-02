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
export const SALT = parseInt(process.env.SALT);
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

export const Token_Access_User_Key = process.env.Token_Access_User_Key;
export const Token_Refresh_User_Key = process.env.Token_Refresh_User_Key;

export const Token_Access_Admin_Key = process.env.Token_Access_Admin_Key;
export const Token_Refresh_Admin_Key = process.env.Token_Refresh_Admin_Key;

export const Refresh_EXPIRATION = Number(process.env.Refresh_EXPIRATION) ; 
export const Access_EXPIRATION = Number(process.env.Access_EXPIRATION) ; 