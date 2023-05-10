import request from "supertest";
import { BASE_URL, X_API_KEY, FILE_PATH } from "./constants";
import { randomString } from "./common.helper";

export const deleteData = async (ids: string[], resource: string) => {
    for (const id of ids) {
        await request(BASE_URL).delete(`/v1/${resource}/${id}`).set({ "x-api-key": X_API_KEY })
    };
    ids = [];
};

export const getUploadedImageId = async () => {
    const response = await request(BASE_URL)
      .post("/v1/images/upload")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "multipart/form-data",
      })
      .attach("file", FILE_PATH);

    return response.body.id;
};

export const createFavourite = async (imageId: string, optionalFavouriteSubId?: string) => {
    const subId = optionalFavouriteSubId ? optionalFavouriteSubId : randomString;

    const response = await request(BASE_URL)
      .post("/v1/favourites")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      })
      .send({
        image_id: imageId,
        sub_id: subId
      });

    const id = response.body.id;
    return { id, subId };
};

// This function uploads multiple images and returns an array of their IDs
export const getUploadedImageIds = async (limit: number) => {
  let imageIds: string[] = [];
  let imageId: string;
  for (let i = 0; i < limit; i = i + 1) {
    imageId = await getUploadedImageId();
    imageIds.push(imageId);
  };

  return imageIds;
};

// This function creates multiple favourites and returns an array of their IDs
export const getCreatedFavouriteIds = async (limit: number, optionalFavouriteSubId?: string) => {
  const imageIds = await getUploadedImageIds(limit);
  let favouriteIds: string [] = [];

  for (let imageId of imageIds) {
    const favourite = optionalFavouriteSubId ? await createFavourite(imageId, optionalFavouriteSubId) : await createFavourite(imageId);
    favouriteIds.push(favourite.id);
  };

  return favouriteIds;
};
