import request from "supertest";
import { BASE_URL, X_API_KEY, TIMEOUT, DUPLICATE_FAVOURITE_MESSAGE, SUCCESS_MESSAGE} from "../../helper/constants";
import { getUploadedImageId, deleteData, createFavourite } from "../../helper/api.helper";

describe("'POST' - /favourites - Post favourite", () => {
  let favouriteIds: string[] = [];
  let imageIds: string[] = [];
  let imageId: string;

  beforeEach(async() => {
    // Get id of newly uploaded image
    imageId = await getUploadedImageId()
    // Store image id for for post step delete
    imageIds.push(imageId);
  }, TIMEOUT);

  it("TDA_11 Verify that the user can create a favourite with a valid image_id", async () => {
    const response = await request(BASE_URL)
      .post("/v1/favourites")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      })
      .send({
        image_id: imageId
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toEqual(SUCCESS_MESSAGE);

    // Store favourite id for for post step delete
    favouriteIds.push(response.body.id);
  }, TIMEOUT);

  it("TDA_15 Verify that the user cannot create a favourite with an existing image_id and sub_id", async () => {
    // Create test favourite
    const favourite = await createFavourite(imageId);
    
    // Store favourite id for for post step delete
    favouriteIds.push(favourite.id);

    const response = await request(BASE_URL)
      .post("/v1/favourites")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      })
      .send({
        image_id: imageId,
        sub_id: favourite.subId
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.text).toEqual(DUPLICATE_FAVOURITE_MESSAGE);
  }, TIMEOUT);

  // Delete test images and favourites
  afterAll(async () => {
    await deleteData(imageIds, 'images');
    await deleteData(favouriteIds, 'favourites');
  }, TIMEOUT);
});
