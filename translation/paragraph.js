import { handleRichTextObj } from "./richText.js";

export const paragraphHandler = (block) => {
    const reversedRichTextArray = block.paragraph.rich_text.slice().reverse();

    // deal with empty paragraphs
    if (reversedRichTextArray.length == 0) {
        return [
            {
                insertText: {
                    location: {
                        index: 1,
                    },
                    text: "\n",
                },
            },
        ];
    }

    const requestsForParagraphBlock = [];
    for (let i = 0; i < reversedRichTextArray.length; i++) {
        // add new line to the end to tell google to end this paragraph block
        if (i == 0) {
            reversedRichTextArray[i].plain_text =
                reversedRichTextArray[i].plain_text + "\n";
        }

        const requestsForRichTextSpan = handleRichTextObj(
            reversedRichTextArray[i]
        );
        requestsForParagraphBlock.push(...requestsForRichTextSpan);
    }

    return requestsForParagraphBlock;
};
