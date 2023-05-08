import request from "supertest";
import path from "path";
import { BASE_URL, X_API_KEY, TIMEOUT, FILENAME } from "../../helper/constants";
import { randomString } from "../../helper/common.helper";

const api = request.agent(BASE_URL);

// Get file path of image file
const filePath = path.join(path.dirname(path.dirname(__dirname)), 'files/dog.jpg');

let imageIds: string[] = [];

describe("'POST' - /images/upload - Post image", () => {
  it("TDA_06 Verify that the user can upload an image with a valid file path", async () => {
    const response = await api
      .post("/v1/images/upload")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "multipart/form-data",
      })
      .attach("file", filePath);
      
    const image = response.body;

    // Store image id for delete later
    imageIds.push(image.id);

    expect(response.statusCode).toBe(201);

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
    const imageSubId = randomString(5)
    const response = await api
      .post("/v1/images/upload")
      .set({
        "x-api-key": X_API_KEY,
        "Content-Type": "multipart/form-data",
      })
      .field('sub_id', imageSubId)
      .attach("file", filePath);
      
    const image = response.body;

    // Store image id for delete later
    imageIds.push(image.id);

    expect(response.statusCode).toBe(201);
    expect(response.body.sub_id).toEqual(imageSubId);
    expect(image.original_filename).toEqual(FILENAME);
  }, TIMEOUT);

  // Delete test images
  afterEach(async () => {
    for (const imageId of imageIds) {
      await api.delete(`/v1/images/${imageId}`).set({ "x-api-key": X_API_KEY });
    };
    imageIds = [];
  });
});
