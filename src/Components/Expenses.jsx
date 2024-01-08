import React, { useEffect, useState } from 'react'
import "../Styles/Expenses.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
export const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const navigate = useNavigate();
    const handlevehicle = () => {
        navigate("/addexpenses");
    }

    useEffect(() => {
        fetchExpenses();
      }, []);
    const fetchExpenses = async () => {
        try {
          const response = await axios.get('https://zany-red-cockatoo.cyclic.app/expenses'); // Replace with your backend API endpoint
          setExpenses(response.data);
        } catch (error) {
          console.error('Error fetching locations:', error);
        }
      };
      const handleDeleteExpense = async (expenseId) => {
        try {
          await axios.delete(`https://zany-red-cockatoo.cyclic.app/expenses/${expenseId}`);
          fetchExpenses();
        //   setAlertMessage('Expense deleted successfully');
        //   setShowAlert(true);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.error('Expense not found:', error.response.data);
          } else {
            console.error('Error deleting Expense:', error);
          }
        }
      };
      const handleEditExpense = () => {
        navigate("/addexpenses");
      }
  return (
    <div className='expensespage-container'>
        <h2 className="vehicle">Vehicle Expenses</h2>
        <hr className="vehicle-line" />
        <div className="vehicle-btn">
        <button onClick={handlevehicle} className="vehicle-btn-1">Add a new vehicle expense</button>
        <div className="fetched-expenses">
            {expenses.length > 0 && <div className='expense-title'><h2>Expenses</h2></div>}
        {expenses.map((expense, index) => (
          <div className='expenses-container' key={index}>
          <button className='edit' >
            <FaEdit onClick={() => handleEditExpense()}/>
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
    </div>
  )
}
