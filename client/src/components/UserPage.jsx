import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Box, Typography, Paper, CircularProgress, Stack } from "@mui/material";

const UserPage = () => {
  const [scores, setScores] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io("https://sports-app-nyuc-backend.onrender.com");

    socketIo.on("dataUpdate", (data) => {
      setScores(data);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        marginTop: "64px",
      }}
    >
      <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "8px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Live Cricket Scores
        </Typography>
        {scores ? (
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            flexWrap="wrap"
          >
            {Object.keys(scores).map((key) => (
              <Paper
                key={key}
                elevation={1}
                sx={{
                  padding: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  flex: "1 1 200px",
                  margin: "0.5rem",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#3f51b5", fontWeight: "bold" }}
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                  {scores[key]}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginTop: "1rem" }}>
              Loading scores...
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserPage;
