import request from "supertest";
import { BASE_URL, X_API_KEY, TIMEOUT, FILENAME, FILE_PATH } from "../../helper/constants";
import { randomString } from "../../helper/common.helper";
import { deleteData } from "../../helper/api.helper";

let imageIds: string[] = [];

describe("'POST' - /images/upload - Post image", () => {
  it("TDA_06 Verify that the user can upload an image with a valid file path", async () => {
    const response = await request(BASE_URL)
      .post("/v1/images/upload")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "multipart/form-data",
      })
      .attach("file", FILE_PATH);
      
    const image = response.body;

    expect(response.statusCode).toBe(201);

    // Store image id for delete later
    imageIds.push(image.id);

    expect(image).toHaveProperty('id');
    expect(image).toHaveProperty('url');
    expect(image).toHaveProperty('width');
    expect(image).toHaveProperty('height');
    expect(image).toHaveProperty('original_filename');
    expect(image).toHaveProperty('pending');
    expect(image).toHaveProperty('approved');

    expect(image.original_filename).toEqual(FILENAME);
  }, TIMEOUT);

  it("TDA_07 Verify that the user can upload an image with a valid file and sub_id", async () => {
    const imageSubId = randomString
    const response = await request(BASE_URL)
      .post("/v1/images/upload")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "multipart/form-data",
      })
      .field('sub_id', imageSubId)
      .attach("file", FILE_PATH);
      
    const image = response.body;

    expect(response.statusCode).toBe(201);

    // Store image id for delete later
    imageIds.push(image.id);

    expect(image.sub_id).toEqual(imageSubId);
    expect(image.original_filename).toEqual(FILENAME);
  }, TIMEOUT);

  // Delete test images
  afterAll(async () => {
    await deleteData(imageIds, 'images');
  });
});