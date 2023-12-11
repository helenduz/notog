import { getGoogleColorObj } from "./utils.js";
import Color from "color";

const colorStringToHexDict = {
    default: {
        fg: "#373530",
    },
    gray: {
        fg: "#787774",
        bg: "#F1F1EF",
    },
    brown: {
        fg: "#976D57",
        bg: "#F3EEEE",
    },
    orange: {
        fg: "#CC772F",
        bg: "#F8ECDF",
    },
    yellow: {
        fg: "#C29243",
        bg: "#FAF3DD",
    },
    green: {
        fg: "#548064",
        bg: "#EEF3ED",
    },
    blue: {
        fg: "#477DA5",
        bg: "#E9F3F7",
    },
    purple: {
        fg: "#A48BBE",
        bg: "#F6F3F8",
    },
    pink: {
        fg: "#B35588",
        bg: "#F9F2F5",
    },
    red: {
        fg: "#C4554D",
        bg: "#FAECEC",
    },
};

const getBgColorObjFromString = (colorString) => {
    const colorInHex = colorStringToHexDict[colorString].bg;
    const jsColorObj = Color(colorInHex);
    return {
        rgbColor: getGoogleColorObj(jsColorObj),
    };
};

const getTextColorObjFromString = (colorString) => {
    const colorInHex = colorStringToHexDict[colorString].fg;
    const jsColorObj = Color(colorInHex);
    return {
        rgbColor: getGoogleColorObj(jsColorObj),
    };
};

export { getBgColorObjFromString, getTextColorObjFromString };
