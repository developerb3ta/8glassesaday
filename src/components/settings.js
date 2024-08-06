import React, { useState, useEffect } from 'react';

const Settings = ({ setSettings }) => {
  const [glasses, setGlasses] = useState(8);
  const [interval, setInterval] = useState(60); // in minutes

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    if (savedSettings) {
      setGlasses(savedSettings.glasses);
      setInterval(savedSettings.interval);
    }
  }, []);

  const saveSettings = () => {
    const settings = { glasses, interval };
    localStorage.setItem('settings', JSON.stringify(settings));
    setSettings(settings);
  };

  return (
    <div>
      <h2>Settings</h2>
      <label class="d-none">
        Number of glasses:
        <input type="number" value={glasses} onChange={(e) => setGlasses(e.target.value)} />
      </label>
      <label>
        Interval (minutes):
        <input type="number" value={interval} onChange={(e) => setInterval(e.target.value)} />
      </label>
      <button onClick={saveSettings}>Save</button>
    </div>
  );
};

export default Settings;
