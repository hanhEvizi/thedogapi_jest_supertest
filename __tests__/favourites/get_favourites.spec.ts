import request from "supertest";
import { BASE_URL, X_API_KEY, TIMEOUT } from "../../helper/constants";
import { createFavourite, deleteData } from "../../helper/api.helper";
import { uploadImage } from "../../helper/api.helper";
import { randomNumber, randomString } from "../../helper/common.helper";

let favouriteIds: string[] = [];
let imageIds: string[] = [];

describe("'POST' - /favourites - Post favourite", () => {
  let imageId: string;
  let limit = randomNumber;
  const favouriteSubId = randomString;

  beforeAll(async() => {
    // Create test images
    for (let i = 0; i < limit; i = i + 1) {
        const image = await uploadImage();
        imageId = image.body.id;

        // Store image id for delete later
        imageIds.push(imageId);
    };
 
    // Create test favourites
    for (imageId of imageIds) {
        const favouriteResponse = await createFavourite(imageId, favouriteSubId);
        const favourite = await favouriteResponse.response;
        
        // Store favourite id for delete later
        favouriteIds.push(favourite.body.id);
    };
  }, TIMEOUT);

  it("TDA_02 Verify that the user can get favourites list by existing sub_id", async () => {
    const response = await request(BASE_URL)
      .get(`/v1/favourites/?sub_id=${favouriteSubId}`)
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(limit);

    // Get all sub_id at favourite list
    const favouriteSubIds = response.body.map((favourite: { sub_id: any }) => favourite.sub_id);  
      
    // Check if all elements in the favouriteSubIds are equal to the favouriteSubId value
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
