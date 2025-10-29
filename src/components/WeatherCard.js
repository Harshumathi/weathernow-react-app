import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather) {
    return null;
  }

  const { temperature, windspeed, weathercode, location } = weather;

  // Weather emoji logic 🌦️
  const getWeatherEmoji = (code) => {
    if (code === 0) return "☀️ Clear Sky";
    if ([1, 2].includes(code)) return "🌤️ Partly Cloudy";
    if ([3, 45, 48].includes(code)) return "☁️ Cloudy";
    if ([51, 53, 55].includes(code)) return "🌦️ Drizzle";
    if ([61, 63, 65].includes(code)) return "🌧️ Rain";
    if ([71, 73, 75].includes(code)) return "❄️ Snow";
    if ([95, 96, 99].includes(code)) return "⛈️ Thunderstorm";
    return "🌈 Nice Weather";
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg w-80">
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        📍 {location || "Your Location"}
      </h2>
      <p className="text-4xl font-bold text-blue-600">{temperature}°C</p>
      <p className="text-lg text-gray-600 mt-2">{getWeatherEmoji(weathercode)}</p>
      <p className="text-md text-gray-500 mt-1">💨 Wind: {windspeed} km/h</p>
    </div>
  );
};

export default WeatherCard;
