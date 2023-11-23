import Wrapper from "./assets/Wrapper";
import { useAppContext } from "./handlers";
import { useEffect } from "react";

const App = () => {
    const {
        authNotionGetToken,
        authNotionRedirect,
        authGoogleGetToken,
        authGoogleRedirect,
        transfer,
        notionIsLoading,
        googleIsLoading,
        notionToken,
        googleToken,
    } = useAppContext();

    // detect if callback from OAuth is done
    useEffect(() => {
        // get the 'code' query parameter from URL
        const url = new URL(window.location.href);
        const authCode = url.searchParams.get("code");
        console.log(authCode);
        // hand code to backend for token exchange
        if (authCode) {
            const scope = url.searchParams.get("scope");
            // callback is from google
            if (scope) {
                if (googleToken == null) {
                    authGoogleGetToken(authCode);
                }
            } else {
                // callback is from notion
                if (notionToken == null) {
                    authNotionGetToken(authCode);
                }
            }
        }
    }, []);

    return (
        <Wrapper className="full-page">
            <h1>notog</h1>
            <div>
                <h3>Authorize to Notion</h3>
                <button
                    type="button"
                    className="btn"
                    onClick={() => {
                        if (notionIsLoading || notionToken) {
                            return;
                        }
                        authNotionRedirect();
                    }}
                >
                    {" "}
                    {notionIsLoading
                        ? "Loading..."
                        : notionToken
                        ? "Success!"
                        : "Log me In!"}
                </button>
            </div>
            <div>
                <h3>Authorize to Google</h3>
                <button
                    type="button"
                    className="btn"
                    onClick={() => {
                        if (googleIsLoading || googleToken) {
                            return;
                        }
                        authGoogleRedirect();
                    }}
                >
                    {googleIsLoading
                        ? "Loading..."
                        : googleToken
                        ? "Success!"
                        : "Log me In!"}
                </button>
            </div>

            <h3>Enter Page ID from Notion</h3>
            <form className="form" id="commentForm" onSubmit={transfer}>
                <label htmlFor="pageID" className="form-label">
                    Page ID
                </label>
                <input type="text" id="pageID" className="form-input" />
                <button type="submit" className="member-btn">
                    Start transfer
                </button>
            </form>
        </Wrapper>
    );
};

export default App;
