"use client";

import React, {useState} from "react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function New(){
    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [steps,setSteps] = useState('')
    const [prepTime,setPreptime] = useState('')
    const[image,setImage]= useState <File | null>(null)
    const[message,setMessage] = useState('')

    const router = useRouter()

    useEffect(()=>{
      const token=localStorage.getItem('token')
       if(!token){
      setMessage('you must be logged in to create a recipe')
      
    }
    },[])
   
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

       const token = localStorage.getItem('token')
        if(!token){
          setMessage('you must be logged in to create a recipe')
          return;
        }
        try {
          const formData = new FormData()

          formData.append('title',title);
          formData.append('description',description);
          formData.append('ingredients',JSON.stringify(ingredients.split(',')))
          formData.append('steps',JSON.stringify(ingredients.split('\n')))
          formData.append('prepTime',prepTime)
          if(image) formData.append('image',image)

          const response = await fetch('https://recipe-api-theta.vercel.app/api/v1/recipe/create-recipe', { // Replace with your Node.js API URL
            method: 'POST',
            headers: {
            
              'Authorization':`Bearer ${token}`
            },
            body: formData,
          });

          const data = await response.json();

          if (response.ok) {
            // localStorage.setItem("token", data.token)
            setMessage('recipe created successful');
            // Optionally, redirect the user or clear the form
            setTimeout(()=>{
                router.push('/dashboard')
            },2000)
          } else {
            setMessage(data.message || 'failed to create recipe');
          }
        } catch (error) {
          setMessage('Error connecting to the server.');
          console.error('Error:', error);
        }
      };
    
    return(
        <div className="flex items-center justify-center min-h-screen bg-white ">

            <form className=" p-8  shadow-lg w-full max-w-md "onSubmit={handleSubmit} >
            <h2 className="text-2xl font-bold text-center text-black mb-6">Create Recipe</h2>
          
            <input type ='text' value={title} onChange={(e)=>setTitle(e.target.value)} required placeholder="Enter recipe title" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
            <textarea  value={description} onChange={(e)=>setDescription(e.target.value)} required placeholder="Enter recipe description" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
            <textarea  value={ingredients} onChange={(e)=>setIngredients(e.target.value)} required placeholder="List all Ingredients " className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
            <textarea  value={steps} onChange={(e)=>setSteps(e.target.value)} required placeholder="List the steps " className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
            <input type ='number' value={prepTime} onChange={(e)=>setPreptime(e.target.value)} required placeholder="Enter prep time in minutes" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
            <input type="file"   accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} required placeholder="Enter prep time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
           <button className="bg-[#ED6B06] text-black w-full py-2 rounded-lg font-semibold hover:bg-orange-600 transition" >Create Recipe </button>

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