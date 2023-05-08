import request from "supertest";
import { BASE_URL, X_API_KEY } from "./constants";

export const deleteData = async (ids: string[]) => {
    for (const id of ids) {
        await request(BASE_URL).delete(`/v1/images/${id}`).set({ "x-api-key": X_API_KEY })
    };
    ids = [];
};
