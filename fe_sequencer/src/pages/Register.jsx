import React, { useEffect, useState } from 'react'
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
export default function Register() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const navigate = useNavigate()
  
  
  //funzione per Login
  async function handleRegister(e) {
    e.preventDefault();
  
    await axios.get("/sanctum/csrf-cookie").then(res => console.log(res));
    try{
    await axios.post("/register", {
      name: name,
      email: email,
      password: password,
      /* password_confirmation: passwordConfirm */
    }).then(res => console.log(res))
    .then(()=> navigate('/'));;
  } catch (e) {
    console.log(e);/* await axios.get("http://localhost:8000/user"); */
  }
}
  
 
  return (
    <>
    <div className='container text-center my-5 p-3 border'>
      <h2>registrer</h2>
    <form onSubmit={(e) => handleRegister(e)}>
    full name
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      password confirmation
       <input
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      <button type="submit">invia</button>
    </form>
    </div>
    
    </>
  );
  

 
}

