import React, { useState } from "react";
import { Button, TextField, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("https://sports-app-nyuc-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setUser({ token: data.token, isAdmin: data.isAdmin });
      navigate(data.isAdmin ? "/admin" : "/user");
    } else {
      alert(data.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("https://sports-app-nyuc-backend.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful! You can log in now.");
      setIsRegistering(false);
    } else {
      alert(data.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
    >
      <Paper
        elevation={3}
        style={{ padding: "2rem", maxWidth: 400, margin: "auto" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {isRegistering ? "Register" : "Login"}
        </Typography>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              {isRegistering ? "Register" : "Login"}
            </Button>
          </Box>
          <Box>
            <Button onClick={() => setIsRegistering(!isRegistering)} fullWidth>
              {isRegistering ? "Switch to Login" : "Switch to Register"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
