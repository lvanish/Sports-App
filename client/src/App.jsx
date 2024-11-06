import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import UserPage from "./components/UserPage";
import AdminPage from "./components/AdminPage";
import { Button, Box } from "@mui/material";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<Login setUser={setUser} />} />
        <Route
          path="/user"
          element={
            user ? (
              user.isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <UserPage />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin"
          element={user && user.isAdmin ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {user && (
        <Box sx={{ position: "fixed", top: 16, right: 16 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            sx={{
              borderRadius: 20,
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
                borderColor: "primary.main",
              },
              borderColor: "primary.main",
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Router>
  );
};

export default App;
