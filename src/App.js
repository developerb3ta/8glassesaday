import React, { useState, useEffect } from 'react';
// import Settings from './components/settings';
import Reminder from './components/reminder';
import Completion from './components/completion';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [waterLevel, setWaterLevel] = useState('water_hundred_drink'); // Default state

  const [settings, setSettings] = useState({});
  const [glassesDrank, setGlassesDrank] = useState(0);
  const [view, setView] = useState('settings');

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    if (savedSettings) {
      setSettings(savedSettings);
      setView('reminder');
    }
  }, []);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    setView('reminder');
  };

  return (
    <div className="App">
      <div class='ripple-background'>
      <div class='circle xxlarge shade1'></div>
      <div class='circle xlarge shade2'></div>
      <div class='circle large shade3'></div>
      <div class='circle mediun shade4'></div>
      <div class='circle small shade5'></div>
      {view === 'settings' ? (
        <Settings setSettings={handleSettingsSave} />
      ) : glassesDrank < settings.glasses ? (
        <Reminder
          settings={settings}
          setView={setView}
          glassesDrank={glassesDrank}
          setGlassesDrank={setGlassesDrank}
        />
      ) : (
        <Completion totalGlasses={settings.glasses} glassesDrank={glassesDrank} />
      )}
      <ToastContainer />    
    </div>
    </div>
  );
};

export default App;
