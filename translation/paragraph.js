import { handleRichTextObj } from "./richText.js";
import { insertNewLineAndSetDefaultParagraphStyle } from "./utils.js";

export const paragraphHandler = (block) => {
    const reversedRichTextArray = block.paragraph.rich_text.slice().reverse();

    const requestsForParagraphBlock = [];
    // adding a new line to tell google this is the end of the paragraph & sets the paragraph's style
    requestsForParagraphBlock.push(
        ...insertNewLineAndSetDefaultParagraphStyle()
    );
    for (let i = 0; i < reversedRichTextArray.length; i++) {
        const requestsForRichTextSpan = handleRichTextObj(
            reversedRichTextArray[i]
        );
        requestsForParagraphBlock.push(...requestsForRichTextSpan);
    }

    return requestsForParagraphBlock;
};
