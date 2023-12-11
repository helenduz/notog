import Color from "color";
import {
    getGoogleColorObj,
    insertNewLineAndSetDefaultParagraphStyle,
} from "./utils.js";

const paragraphBgColor = "#edd3d1";
const warningTextColor = "#F33A17";

const warningText =
    "⚠️ This block is not yet supported by notog, view Notion API response below:\n";
const warningTextStyle = {
    bold: true,
    foregroundColor: {
        color: {
            rgbColor: getGoogleColorObj(Color(warningTextColor)),
        },
    },
    fontSize: {
        magnitude: 17,
        unit: "PT",
    },
};

const paragraphStyle = {
    shading: {
        backgroundColor: {
            color: {
                rgbColor: getGoogleColorObj(Color(paragraphBgColor)),
            },
        },
    },
};

const blockInfoTextStyle = {
    fontSize: {
        magnitude: 12,
        unit: "PT",
    },
};

export const unsupportedHanlder = (block) => {
    // information section
    const blockInfoText = JSON.stringify(block) + "\n";
    const insertBlockInfoRequest = {
        insertText: {
            location: {
                index: 1,
            },
            text: blockInfoText,
        },
    };
    const styleBlockInfoRequest = {
        updateTextStyle: {
            textStyle: blockInfoTextStyle,
            fields: Object.keys(blockInfoTextStyle).join(),
            range: {
                startIndex: 1,
                endIndex: blockInfoText.length + 1,
            },
        },
    };
    const paragraphStyleRequest = {
        updateParagraphStyle: {
            paragraphStyle: paragraphStyle,
            fields: Object.keys(paragraphStyle).join(),
            range: {
                startIndex: 1,
                endIndex: blockInfoText.length + 1,
            },
        },
    };
    // warning text section
    const insertWarningRequest = {
        insertText: {
            location: {
                index: 1,
            },
            text: warningText,
        },
    };
    const styleWarningRequest = {
        updateTextStyle: {
            textStyle: warningTextStyle,
            fields: Object.keys(warningTextStyle).join(),
            range: {
                startIndex: 1,
                endIndex: warningText.length + 1,
            },
        },
    };
    return [
        ...insertNewLineAndSetDefaultParagraphStyle(),
        insertBlockInfoRequest,
        paragraphStyleRequest,
        // the following inherits &| overwrites the paragraph style
        styleBlockInfoRequest,
        insertWarningRequest,
        styleWarningRequest,
        ...insertNewLineAndSetDefaultParagraphStyle(),
    ];
};
