import React, { useEffect, useState } from 'react'
import "../Styles/Addlocation.css"
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
export const AddLocation = () => {
    const [locations, setLocations] = useState([]);
    const[name, setName] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const[address, setAddress] = useState('');
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const checkFields = () => {
        if (!name.trim() || !address.trim()) {
          setIsButtonDisabled(true); // Disable the button if any field is empty
        } else {
          setIsButtonDisabled(false); // Enable the button if all fields are filled
        }
      };

      useEffect(() => {
        checkFields();
      },[name, address]);


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

      const handleSaveLocation = async () => {
        try {
          const newLocation = {
           name,
           address, // Include Going to in newTrip
          };
          await axios.post('https://logbook-emwv.onrender.com/locations', newLocation);
          setName('');
          setAddress('');
          fetchlocation();
          alert('Location added successfully')
        } catch (error) {
          console.error('Error saving trip:', error);
        }
      };

      const handleEditTrip = async (locateId) => {
        try {
          const response = await axios.get(`https://logbook-emwv.onrender.com/locations/${locateId}`);
          const locationToEdit = response.data;
          if (locationToEdit) {
            setShowUpdateButton(true);
            setName(locationToEdit.name);
            setAddress(locationToEdit.address);
            setEditIndex(locateId);
            setShowUpdateButton(true);
            setIsEditing(true);
          } else {
            console.error('Trip not found');
          }
        } catch (error) {
          console.error('Error fetching trip:', error);
        }
      };
      
    
      const handleUpdateLocation = async () => {
        try {
          if (editIndex) {
            const updatedLocations = {
              name,
              address,
            };
      
            // Make the PUT request to update the location with the specified ID
            const response = await axios.put(`https://logbook-emwv.onrender.com/locations/${editIndex}`, updatedLocations);
            
            // Handle response after successful update
            console.log('Location updated:', response.data);
      
            const updatedLocationDetails = response.data;
      
            // Update the locations state with the updated location details
            const updatedLocationList = locations.map((location) => {
              if (location._id === updatedLocationDetails._id) {
                return { ...location, ...updatedLocationDetails };
              }
              return location;
            });
            setShowUpdateButton(false);
            // Additional logic after the update (if needed)
            // Clear form fields and reset editIndex
            setAddress('');
            setName('');
            setEditIndex(null);
            setIsEditing(false);
            setLocations(updatedLocationList);
            alert('Location updated successfully') // Update the locations list with the edited location
          } else {
            console.error('No location selected for editing');
          }
        } catch (error) {
          console.error('Error updating location:', error);
          // Handle errors here, if needed
        }
      };
      
      const handleDeleteLocation = async (id) => {
        try {
          await axios.delete(`https://logbook-emwv.onrender.com/locations/${id}`);
          fetchlocation();
          alert('Location deleted successfully')
          // setAlertMessage('Location deleted successfully');
          // setShowAlert(true);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.error('Location not found:', error.response.data);
          } else {
            console.error('Error deleting trip:', error);
          }
        }
      };
      const handleSaveOrUpdateLocation = async () => {
        if (editIndex) {
          await handleUpdateLocation(editIndex);
          setAlertMessage('Location updated successfully');
        } else {
          handleSaveLocation();
          setAlertMessage('Location saved successfully');
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
    <div className='addlocation'>
        <h3 className='addnewlocation'>Locations</h3>
        <h5 className='manage'>Manage places</h5>
        <div className='location-input'>
        <div className='location-label'>
                <label>Name
                </label>
            </div>
            <div className='location-input'>
            <input placeholder='e.g. Mugg and Bean Durbanville' type="text"value={name}  onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='location-label'>
                <label>Address
                </label>
            </div>
            <div className='location-input'>
            <input placeholder='e.g. 12 Church street, Wellington' type="text" value={address}  onChange={(e) => setAddress(e.target.value)}/>
            </div>
        </div>
        <div className='add-location'>
  <button className={`add-location-btn ${isEditing ? 'location-updated-color' : ''}`} onClick={handleSaveOrUpdateLocation} disabled={isButtonDisabled && !isEditing}>
    {isEditing ? 'Update Location' : 'Save Location'}
    </button>
            </div>
            <div>
            <hr className="location-line" />
            </div>
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
            <h3 className="location-version">Latest Version 1.6.3</h3>
            
    </div>
  )
}
