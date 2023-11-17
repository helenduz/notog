import Wrapper from "./assets/Wrapper";
import { useAppContext } from "./handlers";
import { useEffect } from "react";

const App = () => {
    const {
        authNotion,
        authGoogleGetToken,
        authGoogleRedirect,
        transfer,
        notionIsLoading,
        googleIsLoading,
        notionAuthDone,
        googleAuthDone,
        googleToken,
    } = useAppContext();

    // detech if callback from OAuth is done
    useEffect(() => {
        // check if token already stored
        if (googleToken !== null) {
            return;
        }
        // get the 'code' query parameter from URL
        const url = new URL(window.location.href);
        const authCode = url.searchParams.get("code");
        console.log(authCode);
        // hand code to backend for token exchange
        if (authCode) {
            console.log("about to call get token");
            authGoogleGetToken(authCode);
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
                        authNotion();
                    }}
                >
                    {" "}
                    {notionIsLoading
                        ? "Loading..."
                        : notionAuthDone
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
                        if (googleIsLoading || googleAuthDone) {
                            return;
                        }
                        authGoogleRedirect();
                    }}
                >
                    {googleIsLoading
                        ? "Loading..."
                        : googleAuthDone
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
