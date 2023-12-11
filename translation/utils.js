const getGoogleColorObj = (normalColorObj) => {
    return {
        red: normalColorObj.red() / 255,
        green: normalColorObj.green() / 255,
        blue: normalColorObj.blue() / 255,
    };
};

const insertNewLineAndSetHeadingStyle = (headingType) => {
    const headingParagraphStyle = {
        namedStyleType: headingType,
    };
    return [
        {
            insertText: {
                location: {
                    index: 1,
                },
                text: "\n",
            },
        },
        {
            updateParagraphStyle: {
                paragraphStyle: headingParagraphStyle,
                fields: Object.keys(headingParagraphStyle).join(),
                range: {
                    startIndex: 1,
                    endIndex: 2,
                },
            },
        },
    ];
};

const insertNewLineAndSetDefaultParagraphStyle = () => {
    return [
        {
            insertText: {
                location: {
                    index: 1,
                },
                text: "\n",
            },
        },
        {
            updateParagraphStyle: {
                paragraphStyle: defaultParagraphStyle,
                fields: Object.keys(defaultParagraphStyle).join(),
                range: {
                    startIndex: 1,
                    endIndex: 2,
                },
            },
        },
    ];
};

const defaultParagraphStyle = {
    namedStyleType: "NORMAL_TEXT",
    shading: {
        backgroundColor: {
            color: null,
        },
    },
};

export {
    getGoogleColorObj,
    insertNewLineAndSetDefaultParagraphStyle,
    insertNewLineAndSetHeadingStyle,
};
