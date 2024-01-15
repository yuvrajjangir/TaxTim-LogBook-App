import React, { useEffect, useState } from 'react'
import "../Styles/Addtrip.css"
import { FaEdit, FaTrash } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Button, useToast } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import { Trips } from './Trips';
export const AddTrips = () => {
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
  const [locations, setLocations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const checkFields = () => {
    const isArrivalOdometerValid = typeof arrivalOdometer === 'string';
    const isDepartureOdometerValid = typeof departureOdometer ==='string';
    if (
      !leavingFrom ||
    !goingTo ||
    !isDepartureOdometerValid||
    (isArrivalOdometerValid && arrivalOdometer.trim() === '') ||
    !isArrivalOdometerValid || // Check if arrivalOdometer is not a string
    (isArrivalOdometerValid && arrivalOdometer.trim() === '') || // Only trim if arrivalOdometer is a string
    !selectedReason ||
    !selectedDateTime
    ) {
      setIsButtonDisabled(true); // Disable the button if any field is empty
    } else {
      setIsButtonDisabled(false); // Enable the button if all fields are filled
    }
  };
  const fetchLocations = async () => {
    try {
      const response = await axios.get('https://zany-red-cockatoo.cyclic.app/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    checkFields();
  }, [leavingFrom, goingTo, departureOdometer, arrivalOdometer, selectedReason, selectedDateTime,]);

  useEffect(() => {
    fetchSavedTrips();
    fetchLocations();
  }, []);

  const fetchSavedTrips = async () => {
    try {
      const response = await axios.get('https://zany-red-cockatoo.cyclic.app/trips'); // Replace with your backend API endpoint
      setSavedTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleSaveTrip = async () => {
    try {
      const formattedTime = formatDateTime(selectedDateTime);
      console.log('Formatted Time:', formattedTime); // Log the formatted time
      const newTrip = {
        car: 'Default Car',
        departureOdometer,
        arrivalOdometer,
        reason: selectedReason,
        time: formattedTime,
        leavingFrom, // Include Leaving from in newTrip
        goingTo, // Include Going to in newTrip
      };
      await axios.post('https://zany-red-cockatoo.cyclic.app/trips', newTrip);
      setDepartureOdometer('');
      setArrivalOdometer('');
      setSelectedReason('');
      setSelectedDateTime('');
      setLeavingFrom(''); // Clear Leaving from field
      setGoingTo(''); 
      fetchSavedTrips();
      setSavedTrips([...savedTrips, newTrip]);
      alert('Trip added successfully')
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };
  

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const handleDeleteTrip = async (id) => {
    try {
      await axios.delete(`https://zany-red-cockatoo.cyclic.app/trips/${id}`);
      fetchSavedTrips();
      alert('Trip deleted successfully')
      setShowAlert(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Trip not found:', error.response.data);
      } else {
        console.error('Error deleting trip:', error);
      }
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
        setIsEditing(true);
      } else {
        console.error('Trip not found');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
    }
  };
  

  const handleUpdateTrip = async () => {
    const formattedTime = formatDateTime(selectedDateTime);
    try {
      if (editIndex) {
        const updatedTrip = {
          car: 'Default Car',
          departureOdometer,
          arrivalOdometer,
          reason: selectedReason,
          time: formattedTime,
          leavingFrom, // Include Leaving from in updatedTrip
          goingTo, // Include Going to in updatedTrip
        };
  
        // Make the PUT request to update the trip with the specified tripId
        const response = await axios.put(`https://zany-red-cockatoo.cyclic.app/trips/${editIndex}`, updatedTrip);
        
        // Handle response after successful update, if needed
        console.log('Trip updated:', response.data);
  

        const updatedTripDetails = response.data;

    // Update the savedTrips state with the updated trip details
    const updatedTrips = savedTrips.map((trip) => {
      if (trip._id === updatedTripDetails._id) {
        return { ...trip, ...updatedTripDetails };
      }
      return trip;
    });
    setShowUpdateButton(false);
        // Additional logic after the update (if needed)
        // Clear form fields and reset editIndex
        setDepartureOdometer('');
        setArrivalOdometer('');
        setSelectedDateTime('');
        setSelectedReason('');
        setEditIndex(null);
        setIsEditing(false);
        setLeavingFrom(''); // Clear Leaving from field
        setGoingTo(''); 
        setSavedTrips(updatedTrips);
        alert('Trip updated successfully') // Reset editing trip ID after update
      } else {
        console.error('No trip selected for editing');
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      // Handle errors here, if needed
    }
  };
  
  const reasonOptions = ['Site visit', 'Client meeting', 'Delivery', 'Team Meetings'];
  const handlelocation =() => {
    navigate("/location")
  }

  const handleSaveOrUpdateTrip = async () => {
    if (editIndex) {
      await handleUpdateTrip(editIndex);
      setAlertMessage('Trip updated successfully');
    } else {
      handleSaveTrip();
      setAlertMessage('Trip saved successfully');
    }
    setShowAlert(true);
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
    <div className='add-trip'>
        <h3 className='log'>Log New Trip</h3>
        <h2 className='hello'>Hello :)</h2>
        <p className='something'>Get started by setting up your traveling locations</p>
        <div className='loc-btn'>
            <button onClick={handlelocation} className='loc-btn-1'>
                Setup locations
            </button>
        </div>
        {/* {showAlert && (
        <div className='alert-message'>
          <p>{alertMessage}</p>
        </div>
      )} */}
        <div className='trip-inputs'>
            <div className='label'>
                <label>Leaving from
                </label>
            </div>
            <div className='input'>
  <select className='select-reason' value={leavingFrom} onChange={(e) => setLeavingFrom(e.target.value)} disabled={locations.length === 0}>
    <option className='option-reason' value="">Select from saved places</option>
    {locations.map((location) => (
      <option key={location._id} value={location.name}>
        {location.name}
      </option>
    ))}
  </select>
</div>
<div className='label'>
  <label>Going to</label>
</div>
<div className='input'>
  <select className='select-reason' value={goingTo} onChange={(e) => setGoingTo(e.target.value)} disabled={locations.length === 0}>
    <option className='option-reason' value="">Select from saved places</option>
    {locations.map((location) => (
      <option key={location._id} value={location.name}>
        {location.name}
      </option>
    ))}
  </select>
</div>
            <div className='odometer-label'>
                <label>Odometer on departure
                </label>
            </div>
            <div className='odometer-input'>
            <input placeholder='Km.' type="number" value={departureOdometer}
            onChange={(e) => setDepartureOdometer(e.target.value)} disabled={locations.length === 0}/>
            </div>
            <div className='odometer-label'>
                <label>Odometer on arrival
                </label>
            </div>
            <div className='odometer-input'>
            <input style={{marginBottom:"10px"}} placeholder='Km.' type="number" value={arrivalOdometer}
            onChange={(e) => setArrivalOdometer(e.target.value)} disabled={locations.length === 0}/>
            </div>
            <div className='trip-checkbox'>
            <label className='checkbox2'>
        <input className='check' type="checkbox" onChange={() => {}} disabled={locations.length === 0}/>
        <span className='name'>Private</span>
      </label>
      
      <label className='checkbox'>
        <input className='check' type="checkbox"  onChange={() => {}} disabled={locations.length === 0}/>
        <span className='name'>Buisness</span>
      </label>
      </div>
      <div className='label'>
                <label>Reason of trip
                </label>
            </div>
            <div className='input'>
            <select
            className='select-reason'
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          disabled={locations.length === 0}
        >
          <option className='option-reason' value=''>Select a reason</option>
          {reasonOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
            </div>
        </div>
        <div className='time-label'>
                <label>Time
                </label>
            </div>
            <div className='time-input'>
            <input type="datetime-local" id="datetimeInput" name="datetimeInput" value={selectedDateTime}
          onChange={(e) => setSelectedDateTime(e.target.value)} disabled={locations.length === 0}/>
            </div>
            <div className='save-trip'>
  <button className={`save-trip-btn ${isEditing ? 'updated-color' : ''}`} onClick={handleSaveOrUpdateTrip} disabled={isButtonDisabled && !isEditing}>
    {isEditing ? 'Update Trip' : 'Save Trip'}
  </button>
</div>
            <div>
            <hr className="line-add" />
            </div>
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
  )
}
