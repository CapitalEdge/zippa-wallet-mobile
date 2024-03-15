export const Slugify = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return slug;
};