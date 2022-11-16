// import axios from "axios";
import Axios from "axios";

const auth_axios = Axios.create();

function refreshToken(auth_axios) {
  auth_axios.defaults.headers.common = {
    Authorization: "Bearer " + sessionStorage.getItem("JWTtoken"),
  };
}

export default auth_axios;
