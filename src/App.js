import React, { useState} from "react";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [bgUrl, setBgUrl] = useState(
    "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1950&q=80')"
  );

  // map weather codes to emoji + background
  const weatherBackgrounds = {
    sunny:
      "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1950&q=80')",
    cloudy:
      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')",
    rainy:
      "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1950&q=80')",
    snow:
      "url('https://images.unsplash.com/photo-1608889175123-695abbdc8a58?auto=format&fit=crop&w=1950&q=80')",
    storm:
      "url('https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=1950&q=80')",
    default:
      "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
  };

  const getWeatherEmoji = (code) => {
    if (code < 3) return "☀️";
    if (code < 50) return "☁️";
    if (code < 70) return "🌧️";
    if (code < 90) return "❄️";
    return "⛈️";
  };
  const getWeatherBackground = (code) => {
    if (code < 3) return weatherBackgrounds.sunny;
    if (code < 50) return weatherBackgrounds.cloudy;
    if (code < 70) return weatherBackgrounds.rainy;
    if (code < 90) return weatherBackgrounds.snow;
    return weatherBackgrounds.storm;
  };

  // ------- Search by city (with proxy fallbacks)
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError("🌸 Please enter a city name");
      return;
    }
    setError("⏳ Fetching weather data… please wait!");

    try {
      const geoAPI = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1`;
      const proxy1 = `https://corsproxy.io/?${geoAPI}`;
      const proxy2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        geoAPI
      )}`;

      let geoRes = await fetch(proxy1);
      if (!geoRes.ok) geoRes = await fetch(proxy2);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("🙈 Hmm… can’t find that city. Please check the spelling and try again!");
        setWeather(null);
        return;
      }

      const { latitude, longitude, name, admin1, country } = geoData.results[0];

      const weatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const wProxy1 = `https://corsproxy.io/?${weatherAPI}`;
      const wProxy2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        weatherAPI
      )}`;

      let res = await fetch(wProxy1);
      if (!res.ok) res = await fetch(wProxy2);
      const data = await res.json();

      if (!data.current_weather) {
        setError("⚠️ No weather data available for this location right now.");
        return;
      }

      setWeather({
        city: name,
        state: admin1 || "",
        country,
        temp: data.current_weather.temperature,
        wind: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
      });

      setError("");
      setShowWelcome(false);
      setBgUrl(getWeatherBackground(data.current_weather.weathercode));
    } catch (err) {
      console.error(err);
      setError("🌧️ Couldn’t connect to the weather service. Please check your internet or try again!");
    }
  };

  // ------- Use my location
  const fetchByLocation = () => {
    setError("📍 Getting your weather... please wait a moment ⏳");

    if (!navigator.geolocation) {
      setError("❌ Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locationRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const locationData = await locationRes.json();

          const city =
            locationData.city ||
            locationData.locality ||
            locationData.principalSubdivision ||
            "Unknown City";
          const state = locationData.principalSubdivision || "";
          const country = locationData.countryName || "India";

          let weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          if (!weatherRes.ok) {
            const proxy = `https://corsproxy.io/?https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
            weatherRes = await fetch(proxy);
          }
          const data = await weatherRes.json();
          if (!data.current_weather) {
            setError("⚠️ Weather data temporarily unavailable for your location.");
            return;
          }

          setWeather({
            city,
            state,
            country,
            temp: data.current_weather.temperature,
            wind: data.current_weather.windspeed,
            weathercode: data.current_weather.weathercode,
          });
          setError("");
          setShowWelcome(false);
          setBgUrl(getWeatherBackground(data.current_weather.weathercode));
        } catch (err) {
          console.error("Weather fetch failed:", err);
          setError("🌦️ Could not connect to the weather service. Please check your internet!");
        }
      },
      () => setError("⚠️ Please allow location access to detect your weather.")
    );
  };

  return (
    <div className="app-background" style={{ backgroundImage: bgUrl }}>
      <div className="backdrop">
        {showWelcome && (
          <div className="welcome">
            <h1 className="title">😊 Welcome!</h1>
            <p className="subtitle">Let’s explore today’s weather together 🌤️</p>
            <p className="quote">
              “Wherever you go, no matter the weather, always bring your own sunshine.” ☀️
            </p>
          </div>
        )}

        <div className="center">
          <h1 className="heading">🌤️ Weather Now</h1>
          <h3 className="tagline">Explore your day, one sky at a time ☀️</h3>

          <div className="controls">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input"
            />
            <div className="buttons">
              <button onClick={() => fetchWeather(city)} className="btn primary">Search</button>
              <button onClick={fetchByLocation} className="btn green">📍 Use My Location</button>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          {weather && (
            <div className="card">
              <h2 className="card-title">
                {getWeatherEmoji(weather.weathercode)} {weather.city}
                {weather.state ? `, ${weather.state}` : ""}
                {weather.country ? `, ${weather.country}` : ""}
              </h2>
              <p className="temp">{weather.temp}°C</p>
              <p className="cond">
                {getWeatherEmoji(weather.weathercode)}{" "}
                {weather.weathercode < 50 ? "Cloudy" : "Rainy"}
              </p>
              <p className="wind">💨 Wind: {weather.wind} km/h</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
