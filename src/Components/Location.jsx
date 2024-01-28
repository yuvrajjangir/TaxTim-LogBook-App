import React, { useEffect, useState } from 'react'
import "../Styles/Location.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {Alert, AlertIcon, SlideFade } from '@chakra-ui/react';
export const Location = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const[name, setName] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const[address, setAddress] = useState('');
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    useEffect(() => {
        fetchlocation();
      }, []);
    const fetchlocation = async () => {
        try {
          const response = await axios.get('https://logbook-emwv.onrender.com/locations'); // Replace with your backend API endpoint
          setLocations(response.data);
        } catch (error) {
          console.error('Error fetching locations:', error);
        }
      };
    

  const handlelocation = () => {
    navigate('/addlocation');
  }

  const handleEditTrip = async (locateId) => {
    try {
      const response = await axios.get(`https://logbook-emwv.onrender.com/locations/${locateId}`);
      const locationToEdit = response.data;
      if (locationToEdit) {
        setName(locationToEdit.name);
        setAddress(locationToEdit.address);
        setEditIndex(locateId);
        setShowUpdateButton(true);
        navigate("/addlocation")
      } else {
        console.error('Trip not found');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(`https://logbook-emwv.onrender.com/locations/${id}`);
      fetchlocation();
      setAlertMessage('Location deleted successfully');
      setShowAlert(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Location not found:', error.response.data);
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
    <div className="locations">

 <h2 className="locate">Locations</h2>
 <hr className="locate-line" />

 <div className="locate-btn">
   <button onClick={handlelocation} className="locate-btn-1">Add a new Location</button>
 </div>
 {showAlert && (
        <div className='alert-message'>
          <p>{alertMessage}</p>
        </div>
      )}
 <div className="fetched-locations">
            {locations.length > 0 && <div className='location-title'><h2>Your Locations</h2></div>}
        {locations.map((location) => (
          <div className='location-saved' key={location._id}>
            <button className='edit' onClick={() => handleEditTrip(location._id)}><FaEdit /></button>
            <button className='trash' onClick={() => handleDeleteLocation(location._id)}><FaTrash /></button>
            <p className='name-saved'>⚠️ {location.name}</p>
            <p className='address-saved'>{location.address}</p>
          </div>
        ))}
      </div>
 <h3 className="locate-version">Latest Version 1.6.3</h3>
</div>
</div>
  )
}
