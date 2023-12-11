import Color from "color";
import { getGoogleColorObj } from "./utils.js";

// handles one rich text object = one text run in Google doc / a "span"
// returns an array with insertTextRequest followed by styleTextRequest
export const handleRichTextObj = (richTextObject) => {
    const type = richTextObject.type;
    // @@ support for mention and equation

    const { annotations, plain_text, href } = richTextObject;

    // default foreground & backgrounds
    var foregroundColorObj = Color("black");
    var backgroundColorObj = Color("white");
    const colorString = annotations.color;
    if (colorString !== "default") {
        // contains background color
        if (colorString.includes("background")) {
            const backgroundColorString = colorString.split("_")[0];
            backgroundColorObj = Color(backgroundColorString);
        } else {
            // contains foreground/text color
            foregroundColorObj = Color(colorString);
        }
    }

    // transform into google API color object format
    foregroundColorObj = getGoogleColorObj(foregroundColorObj);
    backgroundColorObj = getGoogleColorObj(backgroundColorObj);

    var textStyle = {
        bold: annotations.bold,
        italic: annotations.italic,
        underline: annotations.underline,
        strikethrough: annotations.strikethrough,
        backgroundColor: {
            color: {
                rgbColor: backgroundColorObj,
            },
        },
        foregroundColor: {
            color: {
                rgbColor: foregroundColorObj,
            },
        },
        fontSize: {
            magnitude: 12,
            unit: "PT",
        },
    };

    if (href) {
        textStyle.link = {
            url: href,
        };
        textStyle.underline = true;
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

    console.log([insertTextRequst, styleTextRequest]);
    return [insertTextRequst, styleTextRequest];
};