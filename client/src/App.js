import Wrapper from "./assets/Wrapper";
import { useAppContext } from "./handlers";
import { useEffect, useState } from "react";

const App = () => {
    const [pageId, setPageId] = useState("");
    const {
        authNotionGetToken,
        authNotionRedirect,
        authGoogleGetToken,
        authGoogleRedirect,
        transfer,
        notionIsLoading,
        googleIsLoading,
        transferIsLoading,
        notionToken,
        googleToken,
        docURL,
    } = useAppContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        transfer(pageId);
    };

    // detect if callback from OAuth is done
    useEffect(() => {
        // get the 'code' query parameter from URL
        const url = new URL(window.location.href);
        const authCode = url.searchParams.get("code");
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
            <form className="form" id="commentForm" onSubmit={handleSubmit}>
                <label htmlFor="pageId" className="form-label">
                    Page ID
                </label>
                <input
                    type="text"
                    name="pageId"
                    className="form-input"
                    onChange={(e) => {
                        setPageId(e.target.value);
                    }}
                    value={pageId}
                />
                <button type="submit" className="member-btn">
                    {transferIsLoading ? (
                        "Transfer in Progress..."
                    ) : docURL ? (
                        <a href={docURL}>Click Here for Google Doc Result</a>
                    ) : (
                        "Start Transfer"
                    )}
                </button>
            </form>
        </Wrapper>
    );
};

// NEXT STEP: test form state change + implement handle submit logic / transfer

export default App;
