import axios from "axios";
import imageType from "image-type";
import { handleRichTextArray } from "./richText.js";
import { insertNewLineAndSetDefaultParagraphStyle } from "./utils.js";
import { unsupportedHanlder } from "./unsupported.js";

export const imageHandler = async (block) => {
    // maybe have a function that deals with file. but what it file is not an image -> how does google doc react? -> note: notion supports more image types than google, might have to convert before adding to google?
    // extra lead: in transfer controller, all api calls should be wrapped with try catch & display error info -> or maybe have overall error handling for web app

    // insert captions (a rich text array)
    const captionsRequests = [];
    captionsRequests.push(...insertNewLineAndSetDefaultParagraphStyle());
    captionsRequests.push(
        ...handleRichTextArray(block.image.caption, null, true)
    );

    // insert image
    const imageFileURLType = block.image.type; // can be "external" or "file"
    const url = block.image[imageFileURLType].url;
    // if image format is not supported, return as a unsupported block
    const { supported, format } = await isImageFormatSupported(url);
    if (!supported) {
        return unsupportedHanlder(
            block,
            `⚠️ This block contains an image whose format is not supported by Google Doc (accepts only JPEG/PNG/GIF). Format detected: ${format}. View Notion API response below:\n`
        );
    }

    const insertImageRequest = {
        insertInlineImage: {
            uri: url,
            location: {
                index: 1,
            },
        },
    };

    // in the list of returned requests, we insert a newline between the caption and the image since the image will be inline
    return [
        ...captionsRequests,
        ...insertNewLineAndSetDefaultParagraphStyle(),
        insertImageRequest,
    ];
};

const isImageFormatSupported = async (url) => {
    const format = await getImageFormat(url);
    // if error occured when determining format, or format is not one of PNG, JPEG, or GIF, then return false
    if (format == null) {
        return {
            supported: false,
            format: format,
        };
    }
    const googleAllowedFormats = new Set([
        "png",
        "jpg",
        "gif",
        "jp2",
        "jpm",
        "jpx",
    ]);
    if (!googleAllowedFormats.has(format)) {
        return {
            supported: false,
            format: format,
        };
    }
    return {
        supported: true,
        format: format,
    };
};

const getImageFormat = async (url) => {
    // download image and determines image format
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data, "binary");
        const type = await imageType(buffer);
        if (type) {
            return type.ext;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};
