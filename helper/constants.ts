require("dotenv").config({ path: ".env.qa" });

export const BASE_URL = "https://api.thedogapi.com";
export const X_API_KEY = process.env.X_API_KEY;
export const TIMEOUT = 10000;
export const FILENAME = 'dog.jpg';
