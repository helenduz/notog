import axios from "axios";
import { appInfoReducer } from "./reducer";
import React, { useReducer, useContext } from "react";
import {
    START_GOOGLE_LOADING,
    START_NOTION_LOADING,
    GOOGLE_AUTH_DONE,
    NOTION_AUTH_DONE,
} from "./actions";

const initialAppInfo = {
    notionIsLoading: false,
    googleIsLoading: false,
    notionAuthDone: false,
    googleAuthDone: false,
};

const AppInfoContext = React.createContext(null);
const DispatchContext = React.createContext(null);

const AppProvider = ({ children }) => {
    const [appInfo, dispatch] = useReducer(appInfoReducer, initialAppInfo);

    const authNotion = () => {
        console.log("authorize to Notion");
    };

    const authGoogleRedirect = async () => {
        try {
            // get auth URL
            const response = await axios.get("/getAuthURL");
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
            await axios.post("/getToken", {
                code,
            });
        } catch (error) {
            console.log(error);
            return;
        }
        dispatch({
            type: GOOGLE_AUTH_DONE,
        });
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
                authNotion,
                authGoogleGetToken,
                authGoogleRedirect,
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
