export const randomString = Math.random().toString(36).substring(2, 8);

export const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
