import request from "supertest";
import { BASE_URL, X_API_KEY, TIMEOUT } from "../../helper/constants";
import { getUploadedImageIds, getCreatedFavouriteIds, deleteData } from "../../helper/api.helper";
import { randomNumber, randomString } from "../../helper/common.helper";

describe("'GET' - /favourites - Get favourites", () => {
  let favouriteIds: string[] = [];
  let imageIds: string[] = [];
  const limit = randomNumber(1,3);
  const favouriteSubId = randomString;

  beforeAll(async() => {
    // Get ids of newly upload images for post step delete
    imageIds = await getUploadedImageIds(limit);

    // Get ids of newly created favourites with input favouriteSubId
    favouriteIds = await getCreatedFavouriteIds(limit, favouriteSubId);
  }, TIMEOUT);

  it("TDA_02 Verify that the user can get favourites list by existing sub_id", async () => {
    const response = await request(BASE_URL)
      .get(`/v1/favourites/?sub_id=${favouriteSubId}`)
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      });
    
    expect(response.statusCode).toBe(200);

    // Check if the number of response.body elements with input favouriteSubId matches the number of newly created favourites with the same input
    expect(response.body.length).toBe(limit);

    // Get all sub_id at favourite list
    const favouriteSubIds = response.body.map((favourites: { sub_id: any }) => favourites.sub_id);  

    // Check if all elements in the favouriteSubIds are equal to the input favouriteSubId
    const allSubIdsEqual = favouriteSubIds.every((sub_id: string) => sub_id === favouriteSubId);
    expect(allSubIdsEqual).toBeTruthy();
  }, TIMEOUT);

  it("TDA_04 Verify that the user can get favourites list when using the 'limit' parameter", async () => {
    const response = await request(BASE_URL)
      .get(`/v1/favourites/?limit=${limit}`)
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(limit);
  }, TIMEOUT);

  // Delete test images and favourites
  afterAll(async () => {
    await deleteData(imageIds, 'images');
    await deleteData(favouriteIds, 'favourites');
  }, TIMEOUT);
});
