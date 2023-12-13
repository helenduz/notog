import { handleRichTextArray } from "./richText.js";
import { insertNewLineAndSetDefaultParagraphStyle } from "./utils.js";

export const paragraphHandler = (block) => {
    const requestsForParagraphBlock = [];
    // adding a new line to tell google this is the end of the paragraph & sets the paragraph's style to default style
    requestsForParagraphBlock.push(
        ...insertNewLineAndSetDefaultParagraphStyle()
    );
    // rich text array requests for the paragraph
    requestsForParagraphBlock.push(
        ...handleRichTextArray(block.paragraph.rich_text)
    );

    return requestsForParagraphBlock;
};
