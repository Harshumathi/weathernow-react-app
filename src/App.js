import React, { useState, useEffect } from "react";

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  // 🌤️ Default background on load
  useEffect(() => {
    document.body.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1950&q=80')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.transition = "background 1s ease-in-out";
  }, []);

  // 🌦️ Weather backgrounds
  const weatherBackgrounds = {
    sunny: "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1950&q=80')",
    cloudy: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')",
    rainy: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1950&q=80')",
    snow: "url('https://images.unsplash.com/photo-1608889175123-695abbdc8a58?auto=format&fit=crop&w=1950&q=80')",
    storm: "url('https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=1950&q=80')",
    default: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
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

  
   // 🌤️ Smart Fetch Weather (with retry)
const fetchWeather = async (cityName) => {
  if (!cityName.trim()) {
    setError("🌸 Please enter a city name");
    return;
  }

  setError("⏳ Fetching weather data… please wait!");
  try {
    const geoAPI = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;
    const proxy1 = `https://corsproxy.io/?${geoAPI}`;
    const proxy2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(geoAPI)}`;

    // Try primary, if fails → fallback
    let geoRes = await fetch(proxy1);
    if (!geoRes.ok) geoRes = await fetch(proxy2);

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      setError("🙈 Hmm… can’t find that city. Please check the spelling and try again!");
      setWeather(null);
      return;
    }

    const { latitude, longitude, name, admin1, country } = geoData.results[0];

    // Fetch weather data
    const weatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const wProxy1 = `https://corsproxy.io/?${weatherAPI}`;
    const wProxy2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(weatherAPI)}`;

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
    document.body.style.backgroundImage = getWeatherBackground(data.current_weather.weathercode);
  } catch (err) {
    console.error(err);
    setError("🌧️ Couldn’t connect to the weather service. Please check your internet or try again!");
  }
};


// 📍 Use My Location (final version - always works)
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
        // 🗺️ Try BigDataCloud reverse geocoding first (more reliable)
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

        // 🌤️ Try Open-Meteo directly (no proxy)
        let weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        // If that fails → fallback to proxy
        if (!weatherRes.ok) {
          const proxy = `https://corsproxy.io/?https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
          weatherRes = await fetch(proxy);
        }

        const data = await weatherRes.json();

        if (!data.current_weather) {
          setError("⚠️ Weather data temporarily unavailable for your location.");
          return;
        }

        // ✅ Update weather info
        setWeather({
          city,
          state,
          country,
          temp: data.current_weather.temperature,
          wind: data.current_weather.windspeed,
          weathercode: data.current_weather.weathercode,
        });

        // ✅ Update background + clear message
        setError("");
        setShowWelcome(false);
        document.body.style.backgroundImage = getWeatherBackground(
          data.current_weather.weathercode
        );
      } catch (err) {
        console.error("Weather fetch failed:", err);
        setError("🌦️ Could not connect to the weather service. Please check your internet!");
      }
    },
    () => setError("⚠️ Please allow location access to detect your weather.")
  );
};


     

  return (
    <div className="min-h-screen text-white p-6 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-all duration-700">
      {/* 🌤️ Welcome until first search */}
      {showWelcome && (
        <div className="absolute top-20 text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">😊 Welcome!</h1>
          <p className="text-lg italic">Let’s explore today’s weather together 🌤️</p>
          <p className="mt-3 text-yellow-200">
            “Wherever you go, no matter the weather, always bring your own sunshine.” ☀️
          </p>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4 text-center mt-16">🌤️ Weather Now</h1>
      <h3 className="text-lg italic mb-10 text-center">Explore your day, one sky at a time ☀️</h3>

      <div className="flex flex-col items-center gap-3">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 rounded-lg text-black w-64 shadow-lg"
        />
        <div className="flex gap-4">
          <button
            onClick={() => fetchWeather(city)}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Search
          </button>
          <button
            onClick={fetchByLocation}
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            📍 Use My Location
          </button>
        </div>
      </div>

      {error && <p className="mt-6 text-red-300 text-center">{error}</p>}

      {weather && (
        <div className="mt-10 bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-2">
            {getWeatherEmoji(weather.weathercode)} {weather.city}
            {weather.state ? `, ${weather.state}` : ""}
            {weather.country ? `, ${weather.country}` : ""}
          </h2>
          <p className="text-4xl font-bold mt-3">{weather.temp}°C</p>
          <p className="text-lg mt-2">
            {getWeatherEmoji(weather.weathercode)}{" "}
            {weather.weathercode < 50 ? "Cloudy" : "Rainy"}
          </p>
          <p className="mt-2">💨 Wind: {weather.wind} km/h</p>
        </div>
      )}
    </div>
  );
}

export default App;
