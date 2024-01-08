import React from 'react'
import { Routes, Route} from 'react-router-dom'
import { Trips } from '../Components/Trips'
import { AddTrips } from '../Components/AddTrips'
import { Login } from '../Components/Login'
import { Forgetpassword } from '../Components/Forgetpassword'
import { Signup } from '../Components/Signup'
import LogBookApp from '../Components/logbook'
import { Location } from '../Components/Location'
import { AddLocation } from '../Components/AddLocation'
import { Expenses } from '../Components/Expenses'
import { AddExpenses } from '../Components/AddExpenses'
import LogbookStats from '../Components/Stats'
export const Allroutes = () => {
  return (
   <Routes>
    <Route path="/trips" element={<Trips/>} />
    <Route path="/addtrip" element={<AddTrips/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/forgetpass" element={<Forgetpassword/>} />
    <Route path="/signup" element={<Signup/>} />
    <Route path="/location" element={<Location/>} />
    <Route path="/addlocation" element={<AddLocation/>} />
    <Route path="/expenses" element={<Expenses/>} />
    <Route path="/addexpenses" element={<AddExpenses/>} />
    <Route path="/stats" element={<LogbookStats/>} />
    {/* <Route path="/pdf" element={<DownloadPDF/>} /> */}

   </Routes>
  )
}
