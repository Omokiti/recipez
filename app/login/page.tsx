
"use client";

import React, {useState} from "react"
import { useRouter } from "next/navigation";

export default function login(){
    const [email,setEmail]=useState('')
    const [password, setPassword] = useState('')
    const [message,setMessage] = useState('')

    const router = useRouter()
   
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        try {
          const response = await fetch('https://recipe-api-theta.vercel.app/api/v1/auth/login-user', { // Replace with your Node.js API URL
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            localStorage.setItem("token", data.token)
            setMessage('Login successful');
            // Optionally, redirect the user or clear the form
            setTimeout(()=>{
                router.push('/dashboard')
            },2000)
          } else {
            setMessage(data.message || 'login failed.');
          }
        } catch (error) {
          setMessage('Error connecting to the server.');
          console.error('Error:', error);
        }
      };
    
    return(
        <div className="flex items-center justify-center min-h-screen bg-white ">

            <form className=" p-8  shadow-lg w-full max-w-md "onSubmit={handleSubmit} >
            <h2 className="text-2xl font-bold text-center text-black mb-6">Welcome back</h2>
          
            <input type ='email' value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
            <input type ='password' value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="Password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
           <button className="bg-[#ED6B06] text-black w-full py-2 rounded-lg font-semibold hover:bg-orange-600 transition" >Log In </button>

           {message && (
            <p className={`mt-4 text-center font-medium ${
                message.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              }`}  >
            {message} 
            </p>
           )}
            </form>
        </div>
    )
}