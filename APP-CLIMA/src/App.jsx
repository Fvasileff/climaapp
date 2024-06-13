//console.log(import.meta.env.VITE_API_KEY);
//import { Message } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import axios from 'axios';


export default function App() {
const [city, setCity] = useState ("");
const [loading, setLoading] = useState (false);
const [error, setError] = useState({
  error: false,
  message: "",
});

const [history, setHistory] = useState([]);

const [weather, setWeather] = useState ({
  city:"",
  country:"",
  temp:"",
  condition:"",
  icon:"",
  conditionText:"",
});

const onSubmit = async(e) => {
  e.preventDefault();
  setLoading(true);
  setError({
    error: false,
    message: "",
  })
  try {
    if(!city.trim()) throw {message: "El campo ciudad es obligatorio"};

    const response = await axios.get(`http://localhost:5000/api/weather?location=${city}`);
   
    setWeather ({
      city: response.data.location.name,
      country: response.data.location.country,
      temp: response.data.current.temp_c,
      condition: response.data.current.condition.code,
      icon: response.data.current.condition.icon,
      conditionText: response.data.current.condition.text,
    });

    fetchHistory();
  } catch (error) {
    setError({
      error: true,
      message: error.message,
    });
  } finally {
    setLoading(false);
  }
};

const fetchHistory = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/history")
      setHistory(response.data)
      console.log(response.data)
  } catch (error) {
    console.error("Error fetch data: ", error)
  }
}

useEffect(() => {
  fetchHistory();
}, [])



  return (
    <Container
    maxWidth="xs"
    sx={{ mt: 2}}
    >
      <Typography
      variant="h3"
      component="h1"
      align="center"
      gutterBottom
      >
        Aplicación de clima
      </Typography>

      <Box
      sx={{display: "grid", gap: 2}}
      component="form"
      autoComplete="off"
      onSubmit={onSubmit}
      >
        <TextField
        id="city"
        label="Ciudad"
        variant="outlined"
        size="small"
        required
        fullWidth
        value={city}
        onChange={(e) => setCity(e.target.value)}
        error={error.error}
        helperText={error.message}
        />

        <LoadingButton
        type="submit"
        variant="containd"
        loading={loading}
        loadingIndicator="Cargando..."
        
        >
        Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
        sx={{
          mt: 2,
          display: "grid",
          gap: 2,
          textAlign: "end",
          
        }}
        >
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>
          <Box 
          component="img"
          alt={weather.conditionText}
          src={weather.icon}
          sx={{ margin: "0 auto" }}
        />
        <Typography variant="h5" component="h3">
          {weather.temp} °C
        </Typography>
        <Typography variant="h6" component="h4">
          {weather.conditionText}
        </Typography>
        </Box>
      )}

      <Typography
      textAlign="center"
      sx={{ mt: 2, fontSize: "10px" }}
      >
        Creada por {" "}

        <a
        href="https://github.com/Fvasileff/"
        title=" Franco Vasileff"
        >
          Franco Vasileff
        </a>
      </Typography>


      <Box>
        <Typography variant="h5" component="h2">
        Historial de Búsquedas
        </Typography>
        <Box sx={{ mt: 2 }}>
          {history.length > 0 ? (
            <ul>
              {history.map((item, index) => (
                <li key={index}>
                  <div>Ubicación buscada: {item.location}</div>
                  <div>Fecha de búsqueda: {format(new Date(item.date), 'dd/MM/yyyy HH:mm:ss')}</div>
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No hay datos de historial disponibles.</Typography>
          )}
        </Box>
      </Box>

    </Container>
  );
}