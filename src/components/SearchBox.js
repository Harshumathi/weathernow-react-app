import React, { useState } from "react";

function SearchBox({ setWeather }) {
  const [city, setCity] = useState("");

  const fetchWeather = async () => {
    if (!city) return alert("Please enter a city name!");

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        alert("City not found!");
        return;
      }

      const { latitude, longitude, name, country } = data.results[0];
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        city: name,
        country,
        ...weatherData.current_weather,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Could not fetch weather. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter your city..."
        className="px-4 py-2 rounded-lg text-black bg-white/90 placeholder-gray-600 shadow-md w-72 outline-none"
      />
      <button
        onClick={fetchWeather}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-semibold shadow-lg"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBox;
