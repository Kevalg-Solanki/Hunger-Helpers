//Modules

import { Route, BrowserRouter as Router, Routes, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react';

//css 
import './css/App.css'

//Components
import Navbar from './components/ContainerComponents/Navbar'

//services
import socket from './services/socket';

//utils
import { DonorElement, NewUserElement, PublicElement, UserElement, VolunteerElement } from './services/AccessController';
import { useFetchUser } from './utils/FetchUser';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//pages 
import Home from './pages/PublicPages/Home'
import Donations from './pages/PublicPages/Donations'
import DonationPoint from './pages/PublicPages/DonationPoint'
import AboutUs from './pages/PublicPages/AboutUs'

import Notifications from './pages/UserPages/Notifications'
import Profile from './pages/UserPages/Profile'

import Login from './pages/AuthPages/Login'
import RegistrationStep1 from './pages/AuthPages/RegistrationStep1';
import RegistrationStep2 from './pages/AuthPages/RegistrationStep2';
import CodeVerification from './pages/AuthPages/CodeVerification';
import ForgotPassword from './pages/AuthPages/ForgotPassword';
import CreateNewPassword from './pages/AuthPages/CreateNewPassword';

import { contextAPI } from './services/Context';
import { handleSuccess } from './utils/Toast';






function App() {


  const {userData,addNotification} = useContext(contextAPI);

  const fetchUser = useFetchUser();

  useEffect(() => {
    console.log("---------------------------------------------------------------")
    const token = localStorage.getItem("Token");
    if (token) {

      fetchUser(token);

    }

   
  }, []);

  useEffect(()=>{
    if (userData?._id) {
      let userId = userData._id;
      let role = userData.role;
      //join room based on role
      console.log("emit")
      socket.emit("join-room", 
        {userId,
        role}
      )
    }

      // Join user's room when component mounts
        if (userData?._id) {
          socket.emit(`${userData.role}`, userData._id);
        }
    
        // Listen for notifications
        socket.on("Donation-Update", (data) => {
          console.log("Notification received:", data);
          
          //adding notificaiton to the local localStorage
          
          addNotification({
            id: Date.now(), // Unique ID
            type: 'Donation-Update', // or 'success', 'error', etc.
            title: data.message,
            message: JSON.stringify(data.metadata),
            createdAt: new Date().toLocaleTimeString()
          });
           
         
        })
    
        socket.on("Request-Update", (data) => {
          console.log("Notification received:", data);
         
          
          addNotification({
            id: Date.now(), // Unique ID
            type: 'Request-Update', // or 'success', 'error', etc.
            title: data.message,
            message: JSON.stringify(data.metadata),
            createdAt: new Date().toLocaleTimeString()
          });
    
          setData(prev => [...prev, data]);
        });
    
        return () => {
          socket.off("Donation-Update");
          socket.off("Request-Update");
    
        };
  },[userData])


  return (

    <>

      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />

        <Route path="/Home" element={<PublicElement><Home /></PublicElement>} />
        <Route path="/Donations" element={<DonorElement><Donations /></DonorElement>} />
        <Route path="/Donation-point" element={<UserElement><DonationPoint /></UserElement>} />
        <Route path="/Aboutus" element={<PublicElement><AboutUs /></PublicElement>} />

        <Route path="/Notifications" element={<UserElement><Notifications /></UserElement>} />
        <Route path="/Profile" element={<UserElement><Profile /></UserElement>} />

        <Route path="/Login" element={<NewUserElement><Login /></NewUserElement>} />
        <Route path='/RegistrationStep1' element={<NewUserElement><RegistrationStep1 /></NewUserElement>} />
        <Route path='/CodeVerification' element={<NewUserElement><CodeVerification /></NewUserElement>} />
        <Route path='/RegistrationStep2' element={<NewUserElement><RegistrationStep2 /></NewUserElement>} />
        <Route path='/ForgotPassword' element={<PublicElement><ForgotPassword /></PublicElement>} />
        <Route path='/CreateNewPassword' element={<PublicElement><CreateNewPassword /></PublicElement>} />




      </Routes>

      <ToastContainer />
    </>


  )
}

export default App;
