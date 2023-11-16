import styled from "styled-components";

const Wrapper = styled.section`
    display: grid;
    align-items: center;
    .logo {
        display: block;
        margin: 0 auto;
        margin-bottom: 1.38rem;
    }
    .form {
        max-width: 400px;
        border-top: 5px solid salmon;
        margin-bottom: 20rem;
    }

    h1 {
        margin-left: 3rem;
    }
    h3 {
        margin-top: 10rem;
        text-align: center;
    }
    p {
        margin: 0;
        margin-top: 1rem;
        text-align: center;
    }
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .btn {
        margin-left: 20rem;
        margin-right: 20rem;
        width: 20%;
        background-color: salmon;
        font-family: "Roboto Slab", Sans-Serif;
        font-size: medium;
    }
    .member-btn {
        margin-top: 2rem;
        background: transparent;
        border: transparent;
        color: salmon;
        cursor: pointer;
        letter-spacing: var(--letterSpacing);
        text-decoration: underline;
    }
`;
export default Wrapper;
