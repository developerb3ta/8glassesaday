import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reminder = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : { interval: 60, glasses: 8 };
  });
  const [lastDrinkTime, setLastDrinkTime] = useState(() => {
    const savedTime = localStorage.getItem('lastDrinkTime');
    return savedTime ? parseInt(savedTime, 10) : Date.now();
  });
  const [countdown, setCountdown] = useState(() => {
    const savedCountdown = localStorage.getItem('countdown');
    return savedCountdown ? parseInt(savedCountdown, 10) : settings.interval * 60;
  });
  const [waterLevel, setWaterLevel] = useState(100); // Set initial water level to 100%
  const [glassesDrank, setGlassesDrank] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [completed, setCompleted] = useState(false); // State to track completion
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    localStorage.setItem('lastDrinkTime', lastDrinkTime);
    localStorage.setItem('countdown', countdown);
  }, [settings, lastDrinkTime, countdown]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastDrinkTime >= settings.interval * 60000) {
        toast('Time to drink water! 🥛');
        if (audioRef.current) {
          audioRef.current.play();
        }
        setLastDrinkTime(now);
        setCountdown(settings.interval * 60); // Reset countdown
      } else {
        const timeLeft = settings.interval * 60 - Math.floor((now - lastDrinkTime) / 1000);
        setCountdown(timeLeft);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastDrinkTime, settings.interval]);

  useEffect(() => {
    if (glassesDrank >= settings.glasses) {
      setCompleted(true); // Mark as completed when all glasses are drunk
    }
  }, [glassesDrank, settings.glasses]);

  const drinkWater = () => {
    if (glassesDrank < settings.glasses) {
      setGlassesDrank(glassesDrank + 1);
      setLastDrinkTime(Date.now());
      setCountdown(settings.interval * 60); // Reset countdown

      // Update water level based on glasses drunk
      const newWaterLevel = waterLevel - 10;
      setWaterLevel(newWaterLevel);
    } else {
      toast("You've already drunk enough water today! 💧💧💧");
    }
  };

  const getWaterClass = () => {
    switch (waterLevel) {
      case 100: return "water_hundred_drink";
      case 90: return "water_ninety_drink";
      case 80: return "water_eighty_drink";
      case 70: return "water_seventy_drink";
      case 60: return "water_sixty_drink";
      case 50: return "water_fifty_drink";
      case 40: return "water_fourty_drink";
      case 30: return "water_thirty_drink";
      case 20: return "water_twenty_drink";
      case 10: return "water_ten_drink";
      default: return "water_zero_drink";
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    setShowSettings(false);
  };

  return (
    <div>
      {!completed ? (
        <div>
          <div>
            <div className="glass-animation">
              <div id="main">
                <h1 className="text-center">Drink Water💧</h1>
                <div id="glass">
                  <div id="water" className={getWaterClass()}></div>
                  <div className="glassLines" id="glassLine1"></div>
                  <div className="glassLines" id="glassLine2"></div>
                  <div className="glassLines" id="glassLine3">
                    <h2 className="text-center"><span class="glassNum">{settings.glasses - glassesDrank}</span> Glasses left</h2>
                    <p className="text-center">Next glass in: {formatTime(countdown)}</p>
                    
                    <div id="hud" class="mobile-btns">
                      <span id="drinkButton" className="button" onClick={drinkWater}>DRINK🥛</span>
                      <span id="settingsButton" className="button" onClick={() => setShowSettings(!showSettings)}>
                        {showSettings ? 'Close' : 'Setup⚙️'}
                      </span>
                    </div>

                  </div>
                </div>
                <div id="hud" class="desktop-btns">
                  <span id="drinkButton" className="button" onClick={drinkWater}>DRINK🥛</span>
                  <span id="settingsButton" className="button" onClick={() => setShowSettings(!showSettings)}>
                    {showSettings ? 'Close' : 'Setup⚙️'}
                  </span>
                </div>
              </div>
            </div>
            {showSettings && (
              <div id="settings" className="settings-panel">
                <h3>Reminder Interval Settings</h3>
                <p>Set how often the notification will run to remind you to drink water</p>
                <label>
                  Interval (minutes):
                  <input
                    type="number"
                    name="interval"
                    value={settings.interval}
                    onChange={handleSettingsChange}
                    min="1"
                  />
                </label>
                <label class="d-none">
                  Glasses per day:
                  <input
                    type="number"
                    name="glasses"
                    value={settings.glasses}
                    onChange={handleSettingsChange}
                    min="1"
                  />
                </label>
                <br />
                <button class="btnSave" onClick={saveSettings}>Save</button>
              </div>
            )}
          </div>
          <audio ref={audioRef} src="/notification.wav" preload="auto"></audio>
        </div>
      ) : (
        <div className="completion-panel">
          <h2>Congratulations!</h2>
          <p>You have drunk all your water for the day.</p>
          <button class="btnSave" onClick={() => setGlassesDrank(0) & setWaterLevel(100) & setCompleted(false)}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default Reminder;
