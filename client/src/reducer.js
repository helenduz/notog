import {
    START_GOOGLE_LOADING,
    START_NOTION_LOADING,
    GOOGLE_AUTH_DONE,
    NOTION_AUTH_DONE,
} from "./actions";

const appInfoReducer = (state, action) => {
    if (action.type === START_GOOGLE_LOADING) {
        return {
            ...state,
            googleIsLoading: true,
        };
    }
    if (action.type === GOOGLE_AUTH_DONE) {
        return {
            ...state,
            googleIsLoading: false,
            googleAuthDone: true,
            googleToken: action.token,
        };
    }
    if (action.type === START_NOTION_LOADING) {
        return {
            ...state,
            notionIsLoading: true,
        };
    }
    if (action.type === NOTION_AUTH_DONE) {
        return {
            ...state,
            notionIsLoading: false,
            notionAuthDone: true,
        };
    }
};

export { appInfoReducer };
