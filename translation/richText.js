import {
    getTextColorObjFromString,
    getBgColorObjFromString,
} from "./colors.js";

// handles one rich text object = one text run in Google doc / a "span"
// returns an array with insertTextRequest followed by styleTextRequest
export const handleRichTextObj = (richTextObject, headingType = null) => {
    const type = richTextObject.type;
    // @@ support for mention and equation

    const { annotations, plain_text, href } = richTextObject;

    // default foreground & backgrounds
    var foregroundColorObj = getTextColorObjFromString("default");
    var backgroundColorObj = null;
    const colorString = annotations.color;
    if (colorString !== "default") {
        // contains background color
        if (colorString.includes("background")) {
            const backgroundColorString = colorString.split("_")[0];
            backgroundColorObj = getBgColorObjFromString(backgroundColorString);
        } else {
            // contains foreground/text color
            foregroundColorObj = getTextColorObjFromString(colorString);
        }
    }

    var textStyle = {
        bold: annotations.bold,
        italic: annotations.italic,
        underline: annotations.underline,
        strikethrough: annotations.strikethrough,
        backgroundColor: {
            color: backgroundColorObj,
        },
        foregroundColor: {
            color: foregroundColorObj,
        },
    };

    if (href) {
        textStyle.link = {
            url: href,
        };
        textStyle.underline = true;
    }

    if (headingType == null) {
        textStyle.fontSize = {
            magnitude: 12,
            unit: "PT",
        };
    }

    const insertTextRequst = {
        insertText: {
            location: {
                index: 1,
            },
            text: plain_text,
        },
    };
    const styleTextRequest = {
        updateTextStyle: {
            textStyle: textStyle,
            fields: Object.keys(textStyle).join(),
            range: {
                startIndex: 1,
                endIndex: plain_text.length + 1,
            },
        },
    };

    return [insertTextRequst, styleTextRequest];
};
