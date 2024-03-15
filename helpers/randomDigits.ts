export const generateRandomNumber = (length: number) => {
    const date = new Date();
    const time = date.getTime().toString();
    const randomNumber = time.substring(time.length - length);
    return randomNumber;
}