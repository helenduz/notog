import { headingsHandler } from "./headings.js";
import { imageHandler } from "./image.js";
import { paragraphHandler } from "./paragraph.js";

export const translatorMap = {
    paragraph: paragraphHandler,
    heading_1: headingsHandler,
    heading_2: headingsHandler,
    heading_3: headingsHandler,
    image: imageHandler,
};
