import { handleRichTextObj } from "./richText.js";
import { insertNewLineAndSetHeadingStyle } from "./utils.js";

export const headingsHandler = (block) => {
    const headingType = block.type;

    const reversedRichTextArray = block[headingType].rich_text
        .slice()
        .reverse();
    // empty heading

    const requestsForHeadingBlock = [];
    // adding a new line to tell google this is the end of the heading paragraph & sets the paragraph's style to the corresponding heading style
    requestsForHeadingBlock.push(
        ...insertNewLineAndSetHeadingStyle(headingType)
    );
    for (let i = 0; i < reversedRichTextArray.length; i++) {
        const requestsForRichTextSpan = handleRichTextObj(
            reversedRichTextArray[i],
            headingType
        );
        requestsForHeadingBlock.push(...requestsForRichTextSpan);
    }

    return requestsForHeadingBlock;
};
