import request from "supertest";
import path from "path";
import { BASE_URL } from "../../helper/constants";

const api = request.agent(BASE_URL);
const filePath = path.join(__dirname, "dog.jpg");

describe("'POST' - /images/upload - Post image", () => {
  it("TDA_06 Verify that the user can upload an image with a valid file path", async () => {
    const response = await api
      .post("/v1/images/upload")
      .set({
        "x-api-key":
          "live_ZQOlINBtwABczolmhjUt4V0K9GlZPR1pPSkJRC3Dxo8dIy2ziv9vbmfgAGCPT3Px",
        "Content-Type": "multipart/form-data",
      })
      .attach("image", filePath);
    console.log("aaa", response.body);
  });
});
