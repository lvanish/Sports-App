import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

const AdminPage = () => {
  const [scores, setScores] = useState({
    teamAScore: "",
    teamBScore: "",
    overs: "",
    wickets: "",
    runRate: "",
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io("http://localhost:4000");

    socketIo.on("dataUpdate", (data) => {
      setScores(data);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handleUpdate = () => {
    if (socket) {
      socket.emit("updateData", scores);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScores((prevScores) => ({ ...prevScores, [name]: value }));
  };

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
          Admin Scoreboard
        </Typography>
        <Stack spacing={2} mb={2}>
          {Object.keys(scores).map((key) => (
            <TextField
              key={key}
              name={key}
              label={key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              value={scores[key]}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="medium"
              sx={{ bgcolor: "white" }}
            />
          ))}
        </Stack>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ width: "200px", height: "40px", fontSize: "1rem" }}
          >
            Update Scores
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminPage;
