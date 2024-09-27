import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid2,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import App from "./App";

export const Inicio = () => {
  const [nombre, setNombre] = useState("");
  const [eleccion, setEleccion] = useState(0);
  const [objeto, setObjeto] = useState({});

  const [tokens, setTokens] = useState([]);

  const [dialog, setDialog] = useState(false);

  const [filtro, setFiltro] = useState({});

  useEffect(() => {
    setNombre("");
    setEleccion(0);
    setObjeto({});
    setFiltro({
      estado: "TODOS",
    });
    setDialog(false);
    verTabla();
  }, []);

  function entrar() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ nombre: nombre }),
      redirect: "follow",
    };

    fetch("http://localhost:3000/login", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let res = JSON.parse(result);
        if (res.message) {
          Swal.fire({
            icon: "error",
            text: res.message,
          });
        } else {
          setObjeto(res.usuario);
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          text: error,
        });
      });
  }

  function crear() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ nombre: nombre }),
      redirect: "follow",
    };

    fetch("http://localhost:3000/crearUsuario", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let res = JSON.parse(result);
        if (res.message) {
          Swal.fire({
            icon: "error",
            text: res.message,
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Usuario Creado",
          });
          entrar();
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          text: error,
        });
      });
  }

  function verTabla() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:3000/tabla", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let res = JSON.parse(result);
        if (res.message) {
          Swal.fire({
            icon: "error",
            text: res.message,
          });
        } else {
          setTokens(
            res.lista
              ? [
                  ...res.lista.map((val) => {
                    return {
                      ...val,
                      Usuario: val.Usuario?.nombre ?? null,
                    };
                  }),
                ]
              : []
          );
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          text: error,
        });
      });
  }

  let columnas = [
    "id",
    "valor",
    "expiracion",
    "estado",
    "fechaUso",
    "usuarioId",
    "Usuario",
  ];

  return (
    <Box sx={{ margin: "20px" }}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Paper elevation={2} sx={{ padding: "20px" }}>
            <Typography variant="h4" align="center">
              <strong>Inicio</strong>
            </Typography>
          </Paper>
        </Grid2>
        {!objeto?.id ? (
          <>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ padding: "10px" }}>
                <Grid2 container spacing={2} sx={{ padding: "10px" }}>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h5" align="center">
                      <strong>Iniciar Sesión</strong>
                    </Typography>
                    <br />
                    {eleccion !== 1 && (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          variant="contained"
                          color="info"
                          onClick={() => setEleccion(1)}
                        >
                          Seleccionar
                        </Button>
                      </Box>
                    )}
                    {eleccion === 1 && (
                      <>
                        <Typography>
                          <strong>Nombre</strong>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={nombre}
                          autoComplete="off"
                          onChange={(e) => setNombre(e.target.value)}
                        />
                        <Button
                          sx={{ marginTop: "10px" }}
                          variant="contained"
                          color="success"
                          disabled={nombre.trim().length < 1}
                          onClick={() => entrar()}
                        >
                          Entrar
                        </Button>
                      </>
                    )}
                  </Grid2>
                </Grid2>
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ padding: "10px" }}>
                <Grid2
                  container
                  spacing={2}
                  sx={{ padding: "10px", width: "100%" }}
                >
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h5" align="center">
                      <strong>Registrarse</strong>
                    </Typography>
                    <br />
                    {eleccion !== 2 && (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          variant="contained"
                          color="info"
                          onClick={() => setEleccion(2)}
                        >
                          Seleccionar
                        </Button>
                      </Box>
                    )}
                    {eleccion === 2 && (
                      <>
                        <Typography>
                          <strong>Nombre</strong>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={nombre}
                          autoComplete="off"
                          onChange={(e) => setNombre(e.target.value)}
                        />
                        <Button
                          sx={{ marginTop: "10px" }}
                          variant="contained"
                          color="success"
                          disabled={nombre.trim().length < 1}
                          onClick={() => crear()}
                        >
                          Crear
                        </Button>
                      </>
                    )}
                  </Grid2>
                </Grid2>
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12 }} sx={{ marginTop: "20px" }}>
              <Typography variant="h5">
                <strong>Lista de Tokens</strong>
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>Valor</strong>
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={filtro?.valor ?? ""}
                autoComplete="off"
                onChange={(e) =>
                  setFiltro({ ...filtro, valor: e.target.value })
                }
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>Estado</strong>
              </Typography>
              <Select
                size="small"
                value={filtro?.estado ?? ""}
                fullWidth
                onChange={(e) =>
                  setFiltro({
                    ...filtro,
                    estado: e.target.value,
                  })
                }
              >
                <MenuItem key={"TODOS"} value="TODOS">
                  TODOS
                </MenuItem>
                <MenuItem key={"USADO"} value="USADO">
                  USADO
                </MenuItem>
                <MenuItem key={"SIN USAR"} value="SIN USAR">
                  SIN USAR
                </MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>Usuario</strong>
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={filtro?.usuario ?? ""}
                autoComplete="off"
                onChange={(e) =>
                  setFiltro({ ...filtro, usuario: e.target.value })
                }
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>Fecha Expiración</strong>
              </Typography>
              <TextField
                fullWidth
                type="date"
                size="small"
                value={filtro?.expiracion ?? new Date()}
                autoComplete="off"
                onChange={(e) => {
                  if (e.target.value) {
                    console.log(new Date(e.target.value).toISOString());
                    setFiltro({ ...filtro, expiracion: e.target.value });
                  } else {
                    setFiltro({ ...filtro, expiracion: null });
                  }
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "gray" }}>
                    <TableRow>
                      {columnas.map((val) => (
                        <TableCell key={val}>
                          <strong>{val}</strong>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tokens
                      .filter(
                        (val) =>
                          val.estado?.includes(
                            filtro?.estado !== "TODOS"
                              ? filtro?.estado ?? ""
                              : ""
                          ) &&
                          val.valor?.includes(filtro?.valor ?? "") &&
                          val.Usuario?.toUpperCase().includes(filtro?.usuario ? filtro?.usuario.toUpperCase() : "") &&
                          val.expiracion?.includes(
                            filtro?.expiracion
                              ? new Date(filtro?.expiracion)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          )
                      )
                      .map((val, index) => (
                        <TableRow key={index + "fila"}>
                          {columnas.map((val2) => (
                            <TableCell key={val2}>{val[val2]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>
          </>
        ) : (
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography>
              <strong>Usuario id: {objeto.id} </strong>
              <strong>Nombre: {objeto.nombre} </strong>
            </Typography>
            <Button
              variant="contained"
              color="success"
              disabled={!objeto?.id}
              onClick={() => setDialog(true)}
            >
              ver Token
            </Button>
          </Grid2>
        )}
      </Grid2>
      <Dialog
        maxWidth="xl"
        fullWidth
        open={dialog}
        onClose={() => {
          setDialog(false);
          setObjeto({});
          setNombre("");
          verTabla();
          setEleccion(1);
        }}
      >
        <DialogContent>
          <App usuario={objeto} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
