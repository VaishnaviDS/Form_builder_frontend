import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FormBuilder from './pages/FormBuilder'
// import FormPreview from './components/FormPreview'
import FormResponse from './pages/FormResponse'
import Header from './components/header/Header'
import Dashboard from './pages/Dashboard'
import Marks from './pages/Forms'
import Forms from './pages/Forms'

const App = () => {
  return (
    <BrowserRouter >
    <Header />
      <Routes>
        <Route path='/' element={<FormBuilder />} />
        <Route path='/forms/:id' element={<FormResponse />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms/all" element={<Forms />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App