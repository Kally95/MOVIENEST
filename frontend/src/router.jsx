import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import RequireAuth from "./auth/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import Lists from "./pages/Lists";
import ListDetails from "./pages/ListDetails";
import NotFound from "./pages/NotFound";
import GuestRoute from "./auth/GuestOnlyAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },

      {
        element: <GuestRoute />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },

      { path: "search", element: <Search /> },
      { path: "movie/:movieId", element: <MovieDetails /> },

      {
        element: <RequireAuth />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "lists", element: <Lists /> },
          { path: "lists/:listId", element: <ListDetails /> },
        ],
      },
    ],
  },
]);
