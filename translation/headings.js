import { handleRichTextArray } from "./richText.js";
import { insertNewLineAndSetHeadingStyle } from "./utils.js";

export const headingsHandler = (block) => {
    const headingType = block.type;

    const requestsForHeadingBlock = [];
    // adding a new line to tell google this is the end of the heading paragraph & sets the paragraph's style to the corresponding heading style
    requestsForHeadingBlock.push(
        ...insertNewLineAndSetHeadingStyle(headingType)
    );
    // rich text array requests for the paragraph
    requestsForHeadingBlock.push(
        ...handleRichTextArray(block[headingType].rich_text, headingType)
    );

    return requestsForHeadingBlock;
};
