import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/SignIn';
import Signup from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route element={<PrivateRoute />} >
        <Route path="/profile" element={<Profile />} />  //making the profile page private before signing in
      </Route>  
    </Routes>
    </BrowserRouter>
  )
}
