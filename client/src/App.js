import Wrapper from "./assets/Wrapper";
import { authGoogle, authNotion, transfer } from "./handlers";

const App = () => {
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
                    Log me in!
                </button>
            </div>
            <div>
                <h3>Authorize to Google</h3>
                <button
                    type="button"
                    className="btn"
                    onClick={() => {
                        authGoogle();
                    }}
                >
                    Log me in!
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
