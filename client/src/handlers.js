const authNotion = () => {
    console.log("authorize to Notion");
};

const authGoogle = () => {
    console.log("authorize to Goole");
};

const transfer = (event) => {
    event.preventDefault();
    console.log("start transfer");
};

export { authNotion, authGoogle, transfer };
