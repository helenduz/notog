import axios from "axios";
import { appInfoReducer } from "./reducer";
import React, { useReducer, useContext } from "react";
import {
    START_GOOGLE_LOADING,
    START_NOTION_LOADING,
    GOOGLE_AUTH_DONE,
    NOTION_AUTH_DONE,
    START_TRANSFER,
    TRANSFER_DONE,
} from "./actions";

// local storage for tokens
const notionTokenLocal = sessionStorage.getItem("notionToken");
const googleTokenLocal = sessionStorage.getItem("googleToken");
const storeGoogleToken = ({ googleToken }) => {
    sessionStorage.setItem("googleToken", JSON.stringify(googleToken));
};
const storeNotionToken = ({ notionToken }) => {
    sessionStorage.setItem("notionToken", notionToken);
};

// context/reducer setup
const initialAppInfo = {
    notionIsLoading: false,
    googleIsLoading: false,
    transferIsLoading: false,
    notionToken: notionTokenLocal,
    googleToken: googleTokenLocal ? JSON.parse(googleTokenLocal) : null,
    docURL: null,
};

const AppInfoContext = React.createContext(null);
const DispatchContext = React.createContext(null);

const AppProvider = ({ children }) => {
    const [appInfo, dispatch] = useReducer(appInfoReducer, initialAppInfo);

    // handlers for calling backend endpoints
    const authNotionRedirect = async () => {
        try {
            // get auth URL
            const response = await axios.get("/getNotionAuthURL");
            const { authURL } = response.data;
            // redirect
            window.location.href = authURL;
        } catch (error) {
            console.log(error);
        }
    };

    const authNotionGetToken = async (code) => {
        try {
            dispatch({
                type: START_NOTION_LOADING,
            });
            const res = await axios.post("/getNotionToken", {
                code,
            });
            console.log(res);
            storeNotionToken({
                notionToken: res.data.token,
            });
            dispatch({
                type: NOTION_AUTH_DONE,
                token: res.data.token,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const authGoogleRedirect = async () => {
        try {
            // get auth URL
            const response = await axios.get("/getGoogleAuthURL");
            const { authURL } = response.data;
            // redirect
            window.location.href = authURL;
        } catch (error) {
            console.log(error);
        }
    };

    const authGoogleGetToken = async (code) => {
        try {
            dispatch({
                type: START_GOOGLE_LOADING,
            });
            const res = await axios.post("/getGoogleToken", {
                code,
            });
            console.log(res);
            storeGoogleToken({
                googleToken: res.data.token,
            });
            dispatch({
                type: GOOGLE_AUTH_DONE,
                token: res.data.token,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const transfer = async (pageId) => {
        const { googleToken, notionToken } = appInfo;
        try {
            dispatch({
                type: START_TRANSFER,
            });
            const response = await axios.post("/transfer", {
                pageId,
                googleToken,
                notionToken,
            });
            dispatch({
                type: TRANSFER_DONE,
                docURL: response.data.docURL,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        // expand the state obj appInfo so that we can directly access fields in the consumers
        <AppInfoContext.Provider
            value={{
                ...appInfo,
                authNotionRedirect,
                authNotionGetToken,
                authGoogleRedirect,
                authGoogleGetToken,
                transfer,
            }}
        >
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </AppInfoContext.Provider>
    );
};

const useAppContext = () => {
    return useContext(AppInfoContext);
};

export { AppProvider, useAppContext };
