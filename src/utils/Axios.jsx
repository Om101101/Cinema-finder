import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTlkNjBkYjYwZmI5YjQxNzQ5MjE3MTFlMWE0YWE1NiIsIm5iZiI6MTc3NDI2MDE2NS4yNDMsInN1YiI6IjY5YzEwZmM1Y2YxY2U2ZjlhNzFiMGZjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sOArCPfskJIroqrgruzt8-ItGE1erfYeyZGbGQpUQC8",
  },
});
export default instance;
