// authUtils.js
export const headers = {
    "Content-Type": "application/json",
    get Authorization() {
        const token = sessionStorage.getItem("accessToken");
        return token ; // Include the JWT token if it exists
    }
};
