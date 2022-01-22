import axios from 'axios';

// function to set token to global headers
// so we can send token with every request
const setAuthToken = (token) => {
    // if token is in local storage
    if (token) {
        // set to global headers
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        // else delete from global headers
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export default setAuthToken;
