import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Styles/Stats.css"
const LogbookStats = () => {
  const [year, setYear] = useState(new Date().getFullYear()); // Initial year is current year
  const [logbookStats, setLogbookStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    // Check if the user is logged in on component mount
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set login status based on the presence of token
    // ... (other logic)
  }, []);
  const handleDownload = async () => {
    if (!isLoggedIn) {
        console.log('User is not logged in.');
        return;
      }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://zany-red-cockatoo.cyclic.app/generate-pdf/${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `logbook-stats-${year}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
        console.error('Error downloading PDF:', error);
        // Display an alert when there's an error or no data available for the year
        if (error.response && error.response.status === 404) {
          alert(`No data available for year ${year}`);
        } else {
          alert('Error downloading PDF. Please try again later.');
        }
      }
  };
  const fetchLogbookStats = async (requestedYear) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const response = await axios.get(`https://zany-red-cockatoo.cyclic.app/logbook/${requestedYear}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the request headers
        },
      });
      setLogbookStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logbook stats:', error);
      setLoading(false);
    }
  };
  const changeYear = (newYear) => {
    setYear(newYear);
    fetchLogbookStats(newYear);
  };

  useEffect(() => {
    fetchLogbookStats(year);
  }, [year]);

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const renderStats = () => {
    if (logbookStats.length === 0) {
      return (
        <div className='logbook-stats'>
            <div className='statring-year-container'>
                <p className='starting'>Starting Date</p>
          <p className='starting-year'>{formatDate(new Date(year, 2, 1))}</p>
          </div>
          <div className='statring-year-container'>
                <p className='starting'>Total Kilometers</p>
          <p className='starting-year'>0</p>
          </div>
          <div className='statring-year-container'>
                <p className='starting'>Business Kilometers</p>
          <p className='starting-year'>0</p>
          </div>
          <div className='statring-year-container'>
                <p className='starting'>Total Expense Cost</p>
          <p className='starting-year'>0</p>
          </div>
          <div className='statring-year-container'>
                <p className='starting'>Total Liters Bought</p>
          <p className='starting-year'>0</p>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          {logbookStats.map((stats, index) => (
            <div key={index}>
                <div className='statring-year-container'>
                <p className='starting'>Starting Date</p>
                <p className='starting-year'>{formatDate(new Date(year, 2, 1))}</p>
                </div>
                <div className='statring-year-container'>
                <p className='starting'>Total Kilometers</p>
                <p className='starting-year'>{stats.totalKilometers}</p>
                </div>
                <div className='statring-year-container'>
                <p className='starting'>Business Kilometers</p>
                <p className='starting-year'>{stats.businessKilometers}</p>
                </div>
                <div className='statring-year-container'>
                <p className='starting'>Total Expense Cost</p>
                <p className='starting-year'>{stats.totalExpenseCost}</p>
                </div>
                <div className='statring-year-container'>
                <p className='starting'>Total Liters Bought</p>
                <p className='starting-year'> {stats.totalLitersBought}</p>
                </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <h2 className='stats'>Stats</h2>
      <hr className="stats-line" />
      <div>
        <button className='previous-stats' onClick={() => changeYear(year - 1)}>🢀 Previous Year</button>
        {/* <span>Current Year: {year}</span> */}
        <button className='next-stats' onClick={() => changeYear(year + 1)}>Next Year 🢂</button>
      </div>
      <div className='stats-name'><h2>Travel logs -
Tax Year {year}</h2></div>
      {loading ? <p>Loading...</p> : renderStats()}
      {isLoggedIn && (
        <div>
            <div>
            <p className='export-tax'>Each Tax year travel starts are exported separately, View required required tax year above and click "Export"</p>
            </div>
          <button className='stats-pdf-btn' onClick={handleDownload}>Export Tax Year</button>
        </div>
      )}
      <h3 className="stats-version">Latest Version 1.6.3</h3>
    </div>
  );
};

export default LogbookStats;