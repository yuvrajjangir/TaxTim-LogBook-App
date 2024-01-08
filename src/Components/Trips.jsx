import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Trips = () => {
    const navigate = useNavigate();
    const [savedTrips, setSavedTrips] = useState([]);
    const [departureOdometer, setDepartureOdometer] = useState('');
  const [arrivalOdometer, setArrivalOdometer] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [leavingFrom, setLeavingFrom] = useState(''); // Add state for Leaving from
  const [goingTo, setGoingTo] = useState(''); 
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handletrip = () => {
    navigate('/addtrip')
  }
  useEffect(() => {
    fetchSavedTrips();
  }, []);

  const fetchSavedTrips = async () => {
    try {
      const response = await axios.get('https://zany-red-cockatoo.cyclic.app/trips'); // Replace with your backend API endpoint
      setSavedTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleEditTrip = async (tripId) => {
    try {
      const response = await axios.get(`https://zany-red-cockatoo.cyclic.app/trips/${tripId}`);
      const tripToEdit = response.data;
      if (tripToEdit) {
        setDepartureOdometer(tripToEdit.departureOdometer);
        setArrivalOdometer(tripToEdit.arrivalOdometer);
        setSelectedReason(tripToEdit.reason);
        setSelectedDateTime(tripToEdit.time);
        setEditIndex(tripId);
        setLeavingFrom(tripToEdit.leavingFrom);
        setShowUpdateButton(true); // Clear Leaving from field
        setGoingTo(tripToEdit.goingTo);
        navigate("/addtrip") 
      } else {
        console.error('Trip not found');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await axios.delete(`https://zany-red-cockatoo.cyclic.app/trips/${id}`);
      fetchSavedTrips();
      setAlertMessage('Trip deleted successfully');
      setShowAlert(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Trip not found:', error.response.data);
      } else {
        console.error('Error deleting trip:', error);
      }
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(''); // Hide the alert after a short duration
      }, 2000); 
      return () => clearTimeout(timeout);// Adjust the duration as needed (here, it's set to 3000 milliseconds or 3 seconds)
    }
  }, [showAlert]);

  
  return (
    <div>
         <div className="trips">

      <h2 className="saved">Saved Trips</h2>
      <hr className="trips-line" />

      <div className="trips-btn">
        <button onClick={handletrip} className="trip-btn-1">Add a new Trip</button>
      </div>
      {showAlert && (
        <div className='alert-message'>
          <p>{alertMessage}</p>
        </div>
      )}
      <div className='saved-trips'>
            {savedTrips.length > 0 && <div className='saved-trip-name'><h2>Saved Trips</h2></div>}
        {savedTrips.map((trip, index) => (
          <div className='saved-trips-container' key={index}>
            <button className='edit' onClick={() => handleEditTrip(trip._id)}><FaEdit /></button>
            <button className='trash' onClick={() => handleDeleteTrip(trip._id)}><FaTrash /></button>
            <p className='places'>⚠️ {trip.leavingFrom} → {trip.goingTo} : </p>
            <p className='dista'>Distance: {trip.distance + " km"}</p>
            <p className='meet-time'>{trip.reason} on {trip.time}</p>
            <p className='car'>{trip.car}</p>
          </div>
        ))}
      </div>

      <h3 className="trip-version">Latest Version 1.6.3</h3>
    </div>
    </div>
  )
}
