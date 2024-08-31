import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'


function App() {

  return (
    <>
      <div className='App'>
        <Routes>
          <Route element={<HomePage />} path='/' />
          <Route element={<ChatPage />} path='/chats' />

        </Routes>
      </div>

    </>
  )
}

export default App
