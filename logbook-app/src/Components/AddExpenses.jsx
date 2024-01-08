import React, { useEffect, useState } from 'react'
import "../Styles/Addexpenses.css";
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
export const AddExpenses = () => {
    const [isFuelSelected, setIsFuelSelected] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState('');
    const [odometer, setOdometer] = useState('');
    const [cost, setCost] = useState('');
    const [time, setTime] = useState('');
    const [litresOfFuel, setLitresOfFuel] = useState('');
    const [savedExpenses, setSavedExpenses] = useState([]);
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showUpdateButton, setShowUpdateButton] = useState(false);

    const checkFields = () => {
        const isodometerValid = typeof odometer === 'string';
        const iscostValid = typeof cost ==='string';
        if (
        !isodometerValid||
        (isodometerValid && odometer.trim() === '') ||
        !iscostValid || // Check if arrivalOdometer is not a string
        (iscostValid && cost.trim() === '') ||
        !selectedExpense ||
        !selectedDateTime
        ) {
          setIsButtonDisabled(true); // Disable the button if any field is empty
        } else {
          setIsButtonDisabled(false); // Enable the button if all fields are filled
        }
      };

      useEffect(() => {
        checkFields();
      },[odometer, cost , selectedDateTime, selectedExpense, litresOfFuel]);

  const handleCheckboxChange = (e) => {
    setIsFuelSelected(e.target.value === 'yes');
  };
  
  const reasonOptions = ['Maintenance/repairs', 'Oil', 'Insurance', 'Licensing', 'Interest/finance changes'];
  useEffect(() => {
    fetchExpenses();
  }, []);
  const fetchExpenses = async () => {
    try {
      const response = await axios.get('https://zany-red-cockatoo.cyclic.app/expenses');
    //   console.log('All Expenses:', response.data);
      setSavedExpenses(response.data); // Update state with fetched expenses
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // Add logic to handle error cases
    }
  };

  
  const handleSaveExpense = async () => {
    try {
      const formattedTime = formatDateTime(selectedDateTime);
    //   console.log('Formatted Time:', formattedTime); // Log the formatted time
      const newexpense = {
        car: 'Default Car',
        odometer,
        cost,
        time: formattedTime,
        reason: selectedExpense,
        isFuel: isFuelSelected,
        litresOfFuel: isFuelSelected ? litresOfFuel : null,
      };
      await axios.post('https://zany-red-cockatoo.cyclic.app/expenses', newexpense);
      setOdometer('');
      setCost('');
      setTime('');
      setSelectedExpense('');
      setLitresOfFuel('');
      setSavedExpenses([...savedExpenses, newexpense]);
    } catch (error) {
      console.error('Error saving Location:', error);
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

  const handleEditExpense = async (expenseId) => {
    try {
      const response = await axios.get(`https://zany-red-cockatoo.cyclic.app/expenses/${expenseId}`);
      const expenseToEdit = response.data;
  
      if (expenseToEdit) {
        setShowUpdateButton(true);
        setOdometer(expenseToEdit.odometer);
        setCost(expenseToEdit.cost);
        setTime(expenseToEdit.time);
        setSelectedExpense(expenseToEdit.reason);
        setIsFuelSelected(!!expenseToEdit.isFuel); // Check if 'isFuel' exists and set accordingly
        setLitresOfFuel(expenseToEdit.litresOfFuel);
        setEditIndex(expenseId);
        setIsEditing(true);
      } else {
        console.error('Expense not found');
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
    }
  };

  const handleUpdateExpense = async () => {
    const formattedTime = formatDateTime(selectedDateTime);
    try {
      if (editIndex) {
        const updatedExpense = {
          odometer,
          cost,
          time: formattedTime,
          reason: selectedExpense,
          isFuel: isFuelSelected,
          litresOfFuel: isFuelSelected ? litresOfFuel : null,
        };
  
        const response = await axios.put(`https://zany-red-cockatoo.cyclic.app/expenses/${editIndex}`, updatedExpense);
  
        console.log('Expense updated:', response.data);
  
        // Handle response after successful update, if needed
  
        const updatedExpenseDetails = response.data;
  
        const updatedExpenses = savedExpenses.map((expense) => {
          if (expense._id === updatedExpenseDetails._id) {
            return { ...expense, ...updatedExpenseDetails };
          }
          return expense;
        });
        setIsButtonDisabled(false);
        setShowUpdateButton(false);
  
        // Additional logic after the update (if needed)
        setOdometer('');
        setCost('');
        setTime('');
        setSelectedExpense('');
        setIsFuelSelected(false);
        setLitresOfFuel('');
        setEditIndex(null);
        setIsEditing(false);
        setSavedExpenses(updatedExpenses);
      } else {
        console.error('No expense selected for editing');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      // Handle errors here, if needed
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`https://zany-red-cockatoo.cyclic.app/expenses/${expenseId}`);
      fetchExpenses();
      setAlertMessage('Expense deleted successfully');
      setShowAlert(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Expense not found:', error.response.data);
      } else {
        console.error('Error deleting Expense:', error);
      }
    }
  };
const handleSaveOrUpdateTrip = async () => {
    if (editIndex) {
      await handleUpdateExpense(editIndex);
      setAlertMessage('Expense updated successfully');
    } else {
      handleSaveExpense();
      setAlertMessage('Expense saved successfully');
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
    <div className='add-expense-container'>
        <h3 className='expense'>Expense</h3>
        {showAlert && (
        <div className='alert-message'>
          <p>{alertMessage}</p>
        </div>
      )}
        <div className='vehicle-label'>
                <label>Odometer
                </label>
            </div>
            <div className='vehicle-input'>
            <input  type="number" value={odometer} onChange={(e) => setOdometer(e.target.value)}/>
            </div>
            <label className='vehicle-label-ed'>Is this fuel?</label>
            <div className='vehicle-checkbox'>
            <label className='check-input-vehicle'>
        <input className='check-input' type="checkbox" value="yes"
            onChange={handleCheckboxChange}
            checked={isFuelSelected} />
        <span className='vehicle-name'>Yes</span>
      </label> 
      </div>
      <div className='vehicle-checkbox'>
            <label className='check-input-vehicle-1'>
        <input className='check-input' type="checkbox" value="no"
            onChange={handleCheckboxChange}
            checked={!isFuelSelected} />
        <span className='vehicle-name'>No</span>
      </label> 
      </div>
      {isFuelSelected ? (
        <div>
            <div className='fuel-yes'>
          <label >Litres of fuel put in</label>
          </div>
          <input style={{marginBottom:"2px"}} className='fuel-input' type="text" id="fuelType" name="fuelType" value={litresOfFuel} onChange={(e) => setLitresOfFuel(e.target.value)}/>
        </div>
      ) : null}
      <div className='vehicle-label'>
                <label>What was it for?
                </label>
            </div>
            <div className='vehicle-input'>
            <select
            className='vehicle-select'
          value={selectedExpense}
          onChange={(e) => setSelectedExpense(e.target.value)}
        >
          <option className='vehicle-option' value=''>Select a reason</option>
          {reasonOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
            </div>
            <div className='vehicle-label'>
                <label>Cost(ZAR)
                </label>
            </div>
            <div className='vehicle-input'>
            <input  type="number" value={cost}
    onChange={(e) => setCost(e.target.value)}/>
            </div>
            <div style={{marginTop:"-2px"}} className='vehicle-label'>
                <label>Time
                </label>
            </div>
            <div className='vehicle-input'>
            <input type="datetime-local" id="datetimeInput" name="datetimeInput" value={selectedDateTime}
          onChange={(e) => setSelectedDateTime(e.target.value)}/>
            </div>
            <button className={`expense-save-btn ${isEditing ? 'expense-updated-color' : ''}`} onClick={handleSaveOrUpdateTrip} disabled={isButtonDisabled && !isEditing}>
    {isEditing ? 'Update Expense' : 'Save Expense'}
    </button>
            <div>
            <hr className="expense-line-add" />
            </div>
            <div className='expense-the'>
        {savedExpenses.length > 0 && (
          <div className='expense-the-name'>
            <h2>Saved Expenses</h2>
          </div>
        )}
        {savedExpenses.map((expense, index) => (
          <div className='expenses-container' key={index}>
            <button className='edit' onClick={() => handleEditExpense(expense._id)} >
              <FaEdit />
            </button>
            <button className='trash' onClick={() => handleDeleteExpense(expense._id)}>
              <FaTrash />
            </button>
            <p className='expenses-reason'>⚠️ {expense.reason}</p>
            <p className='expenses-odo'>Odometer: {expense.odometer} |</p>
            <p className='expense-cost'>Cost: ZAR{expense.cost} |</p>
            <p className='expense-time'>Time: {expense.time}</p>
            {expense.litresOfFuel && (
            <p className='expenses-quantity'>Quantity: {expense.litresOfFuel}</p>
         )}
          <p className='car'>Car 1 - unknown</p>
          </div>
        ))}
        </div>
    </div>
    
  )
}
