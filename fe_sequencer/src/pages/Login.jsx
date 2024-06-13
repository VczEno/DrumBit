import React, { useEffect, useState } from 'react'
import axios from '../api/axios';
import {useNavigate} from 'react-router-dom'
export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  //funzione per Login
  async function handleSubmit(e) {
    e.preventDefault();
  
    await axios.get("/sanctum/csrf-cookie").then(res => console.log(res));
    await axios.post("/login", {
      email: email,
      password: password,
    }).then(res => console.log(res))
    .then(()=> navigate('/'));
    /* await axios.get("http://localhost:8000/user"); */
  }
  
 
  return (
    <>
    <div className='container text-center my-5 p-3 border'>
      <h2>prova per login</h2>
    <form onSubmit={(e) => handleSubmit(e)}>
      email
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      password
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">invia</button>
    </form>
    </div>
    
    </>
  );
  

 
}

