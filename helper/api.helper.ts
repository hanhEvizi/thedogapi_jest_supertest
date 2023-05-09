import request from "supertest";
import { BASE_URL, X_API_KEY, FILE_PATH } from "./constants";
import { randomString } from "./common.helper";

export const deleteData = async (ids: string[], resource: string) => {
    for (const id of ids) {
        await request(BASE_URL).delete(`/v1/${resource}/${id}`).set({ "x-api-key": X_API_KEY })
    };
    ids = [];
};

export const uploadImage = async () => {
    return request(BASE_URL)
      .post("/v1/images/upload")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "multipart/form-data",
      })
      .attach("file", FILE_PATH);
};

export const createFavourite = async (imageId: string) => {
    const favouriteSubId = randomString;
    const response = request(BASE_URL)
      .post("/v1/favourites")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      })
      .send({
        image_id: imageId,
        sub_id: favouriteSubId
      });

    return { response, favouriteSubId };
};
