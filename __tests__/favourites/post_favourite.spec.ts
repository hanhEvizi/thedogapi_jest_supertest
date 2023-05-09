import request from "supertest";
import { BASE_URL, X_API_KEY, TIMEOUT, DUPLICATE_FAVOURITE_MESSAGE, SUCCESS_MESSAGE} from "../../helper/constants";
import { createFavourite, deleteData } from "../../helper/api.helper";
import { uploadImage } from "../../helper/api.helper";

let favouriteIds: string[] = [];
let imageIds: string[] = [];

describe("'POST' - /favourites - Post favourite", () => {
  let imageId: string;
  beforeEach(async() => {
    // Upload an image before create an favourite
    const image = await uploadImage()
    imageId = image.body.id;

    // Store image id for delete later
    imageIds.push(imageId);
  });

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

    // Store favourite id for delete later
    favouriteIds.push(response.body.id);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toEqual(SUCCESS_MESSAGE);
  }, TIMEOUT);

  it("TDA_15 Verify that the user cannot create a favourite with an existing image_id and sub_id", async () => {
    // Create test favourite
    const favouriteResponse = await createFavourite(imageId);
    const favourite = await favouriteResponse.response;

    const response = await request(BASE_URL)
      .post("/v1/favourites")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      })
      .send({
        image_id: imageId,
        sub_id: favouriteResponse.favouriteSubId
      });

    // Store favourite id for delete later
    favouriteIds.push(favourite.body.id);
    
    expect(response.statusCode).toBe(400);
    expect(response.text).toEqual(DUPLICATE_FAVOURITE_MESSAGE);
  }, TIMEOUT);

  // Delete test images and favourites
  afterAll(async () => {
    await deleteData(imageIds, 'images');
    await deleteData(favouriteIds, 'favourites');
  });
});
