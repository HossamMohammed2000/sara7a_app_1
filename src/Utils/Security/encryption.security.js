import crypto from "node:crypto";
import {ENCRYPTION_SECRET} from "../../../config/config.service.js";

const IV_LENGTH = 16;  
const ENCRYPTION_SECRET_KEY =ENCRYPTION_SECRET;

export const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (encryptedText) => {
    const [ivHex, encryptedHex] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
};