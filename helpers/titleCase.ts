export const titleCase = (str: string)  => {
    return str.toLowerCase().replace(/\b\w/g, (s: string) => s.toUpperCase());
}