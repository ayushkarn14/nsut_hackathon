import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { FaHome, FaChartLine, FaComments, FaHistory, FaUser } from 'react-icons/fa';
import Home from './components/Home';
import Graphs from './components/Graphs';
import Chat from './components/Chat';
import MedicalHistory from './components/MedicalHistory';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
import axios from 'axios';
import './styles/App.css';

const App = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [intervalId, setIntervalId] = useState(null);
  const [duration, setDuration] = useState('30sec');

  const handleWatchClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://10.100.93.107:8000/send_full_data');
      console.log('External API response:', response.data);

      await axios.post('http://10.100.91.208:5000/store-patient-data', response.data, {
        headers: {
          'x-access-token': token,
        },
      });
    } catch (error) {
      console.error('Error fetching data from external API:', error);
    }
  };

  const getIntervalFromDuration = (duration) => {
    switch (duration) {
      case '30sec':
        return 30000;
      case '1min':
        return 60000;
      case '5mins':
        return 300000;
      case '10mins':
        return 600000;
      default:
        return 30000;
    }
  };

  useEffect(() => {
    const interval = getIntervalFromDuration(duration);
    const newIntervalId = setInterval(handleWatchClick, interval);
    setIntervalId(newIntervalId);

    return () => clearInterval(newIntervalId);
  }, [duration]);

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Health Dashboard</h1>
        </header>
        <Switch>
          <Route path="/" exact>
            {isLoggedIn ? <Home setDuration={setDuration} duration={duration} /> : <Redirect to="/login" />}
          </Route>
          <Route path="/graphs">
            {isLoggedIn ? <Graphs /> : <Redirect to="/login" />}
          </Route>
          <Route path="/chat" component={Chat} />
          <Route path="/medical-history" component={MedicalHistory} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
        </Switch>
        {isLoggedIn && (
          <nav>
            <ul>
              <li>
                <NavLink exact to="/" activeClassName="active">
                  <FaHome />
                </NavLink>
              </li>
              <li>
                <NavLink to="/graphs" activeClassName="active">
                  <FaChartLine />
                </NavLink>
              </li>
              <li>
                <NavLink to="/chat" activeClassName="active">
                  <FaComments />
                </NavLink>
              </li>
              <li>
                <NavLink to="/medical-history" activeClassName="active">
                  <FaHistory />
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" activeClassName="active">
                  <FaUser />
                </NavLink>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </Router>
  );
};

export default App;