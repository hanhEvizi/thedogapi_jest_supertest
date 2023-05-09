import path from "path";

export const BASE_URL = "https://api.thedogapi.com";
export const X_API_KEY = process.env.X_API_KEY;
export const TIMEOUT = 20000;
export const FILENAME = "dog.jpg";

// Get file path of image file
export const FILE_PATH = path.join(path.dirname(__dirname), `files/${FILENAME}`);
export const DUPLICATE_FAVOURITE_MESSAGE = "DUPLICATE_FAVOURITE - favourites are unique for account + image_id + sub_id";
export const SUCCESS_MESSAGE = 'SUCCESS';
