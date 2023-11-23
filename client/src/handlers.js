import axios from "axios";
import { appInfoReducer } from "./reducer";
import React, { useReducer, useContext } from "react";
import {
    START_GOOGLE_LOADING,
    START_NOTION_LOADING,
    GOOGLE_AUTH_DONE,
    NOTION_AUTH_DONE,
} from "./actions";

// local storage for tokens
const notionTokenLocal = localStorage.getItem("notionToken");
const googleTokenLocal = localStorage.getItem("googleToken");
const storeGoogleToken = ({ googleToken }) => {
    localStorage.setItem("googleToken", googleToken);
};
const storeNotionToken = ({ notionToken }) => {
    localStorage.setItem("notionToken", notionToken);
};

// context/reducer setup
const initialAppInfo = {
    notionIsLoading: false,
    googleIsLoading: false,
    notionToken: notionTokenLocal,
    googleToken: googleTokenLocal,
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

    const transfer = (event) => {
        event.preventDefault();
        console.log("start transfer");
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
