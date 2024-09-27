import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const App = ({ usuario }) => {
  const [token, setToken] = useState({});

  const [progress, setProgress] = React.useState(new Date());
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("nuevo");
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");
      socketRef.current.emit("usuario", usuario?.id ?? null);
      socketRef.current.on("token", (msg) => {
        console.log(msg);
        setToken(msg.token);
      });
    }

    const timer = setInterval(() => {
      console.log("hola", token?.valor);
      setProgress(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      console.log("desconectar");
      socketRef.current.disconnect();
      socketRef.current.off("usuario");
      socketRef.current.off("token");
      socketRef.current = null;
    };
  }, []);

  return (
    <Box sx={{ margin: "20px" }}>
      <Typography sx={{ fontSize: "24px" }}>
        <strong>Usuario ID: </strong>
        {usuario?.id}
        <br />
        <strong>Nombre: </strong>
        {usuario?.nombre}
      </Typography>
      <Box>
        <Typography align="center" sx={{ fontSize: "28px" }}>
          <strong>Token:</strong> {token?.valor}
        </Typography>
        {token?.expiracion && progress && (
          <Stack direction={"row"} spacing={2}>
            <Typography align="left" sx={{ fontSize: "20px" }}>
              <strong>Expira en:</strong>{" "}
              {token?.expiracion
                ? Math.floor(
                    (new Date(token?.expiracion).getTime() -
                      new Date(progress).getTime()) /
                      1000
                  ) + " segundos"
                : "--"}
            </Typography>
            <CircularProgress
              variant="determinate"
              value={Number(
                ((new Date(token?.expiracion).getTime() -
                  new Date(progress).getTime()) /
                  60000) *
                  100
              )}
            />
          </Stack>
        )}
        <br />
        <Typography align="left" sx={{ fontSize: "20px" }}>
          <strong>Vence el:</strong>{" "}
          {new Date(token?.expiracion).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
