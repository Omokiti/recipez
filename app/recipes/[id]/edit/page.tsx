// "use client"

// import {useState,useEffect} from "react"
// import { useParams,useRouter } from "next/navigation"

// export default function EditRecipe(){
//     const{id} = useParams()
//     const router = useRouter()

//     const [title,setTitle] = useState('')
//     const [description,setDescription] = useState('')
//     const [ingredients, setIngredients] = useState('')
//     const [steps,setSteps] = useState('')
//     const [prepTime,setPreptime] = useState('')
//     const[image,setImage]= useState <File | null>(null)
//     const [imageUrl, setImageUrl] = useState<string>("");
//     const[message,setMessage] = useState('')


//     useEffect(()=>{
//         if (!id) return;
        
//         async function fetchRecipe(){
//             const token = localStorage.getItem("token");
//         try {
//             const res = await fetch (`https://recipe-api-theta.vercel.app/api/v1/recipe/${id}/details`,
//             {
//                 headers:{
//                     Authorization:`Bearer ${token}`
//                 }
//             }
            
//             )
//             const data = await res.json()
          
//             const recipe = data.recipe ?? data;

//             setTitle(recipe.title)
//             setDescription(recipe.description)
//             setIngredients(recipe.ingredients)
//             setSteps(recipe.steps)
//             setPreptime(recipe.prepTime.toString())
//             setImageUrl(recipe.image)
//             setMessage(data.message)
//         } catch (error) {
//             console.error('error fetching recipe',error)
//         }
       
//         }
//         fetchRecipe();
//     },[id])

//  const handleSubmit = async(e:React.FormEvent)=>{
//     e.preventDefault()

//     const token = localStorage.getItem("token");

//   const formData = new FormData()
//    formData.append("title",title);
//    formData.append("description",description);
//    formData.append("ingredients",ingredients);
//    formData.append("steps",steps);
//    formData.append("prepTime",prepTime.toString());

//     if(image){
//         formData.append("image",image)
//     }

//     try {
//         const res = await fetch(`https://recipe-api-theta.vercel.app/api/v1/recipe/${id}/update`,{
//         method:'PUT',
//         headers:{  
//         Authorization:`Bearer ${token}`
//         } ,
//         body:formData
//         });

//         const data = await res.json()
        
//         if(res.ok){
//             setMessage('Recipe updated successfully')
//             setTimeout(()=>router.push('/dashboard'),1500)
//         }else{
//             setMessage(data.message || 'failed to update recipe')
//         }
//     } catch (error) {
//         console.error('update error',error)
        
//     }

//  }

// return(
//     <div className="flex items-center justify-center min-h-screen bg-white ">

//             <form className=" p-8  shadow-lg w-full max-w-md "onSubmit={handleSubmit} >
//             <h2 className="text-2xl font-bold text-center text-black mb-6">Edit Recipe</h2>
          
//             <input type ='text' value={title} onChange={(e)=>setTitle(e.target.value)} required placeholder="Enter recipe title" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
//             <textarea  value={description} onChange={(e)=>setDescription(e.target.value)} required placeholder="Enter recipe description" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
//             <textarea  value={ingredients} onChange={(e)=>setIngredients(e.target.value)} required placeholder="List all Ingredients " className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
//             <textarea  value={steps} onChange={(e)=>setSteps(e.target.value)} required placeholder="List the steps " className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
//             <input type ='number' value={prepTime} onChange={(e)=>setPreptime(e.target.value)} required placeholder="Enter prep time in minutes" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
            
//             {imageUrl && (
//           <img
//             src={imageUrl}
//             alt="Recipe"
//             className="w-full h-40 object-cover rounded mb-4"
//           />
//         )}
            
//             <input type="file"   accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
          
          
//            <button className="bg-[#ED6B06] text-black w-full py-2 rounded-lg font-semibold hover:bg-orange-600 transition" > Update Recipe </button>

//            {message && (
//             <p className={`mt-4 text-center font-medium ${
//                 message.includes("successful")
//                   ? "text-green-600"
//                   : "text-red-600"
//               }`}  >
//             {message} 
//             </p>
//            )}
//             </form>
//         </div>
// )

// }

"use client"

import { useState, useEffect, Suspense } from "react" // Added Suspense
import { useParams, useRouter } from "next/navigation"

// 1. Move your main logic into a separate component
function EditRecipeForm() {
    const { id } = useParams()
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [steps, setSteps] = useState('')
    const [prepTime, setPreptime] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!id) return;
        
        async function fetchRecipe() {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`https://recipe-api-theta.vercel.app/api/v1/recipe/${id}/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json()
                // Debugging: check the console in production to see if data exists
                console.log("Recipe Data:", data);

                const recipe = data.recipe ?? data;

                if (recipe) {
                    setTitle(recipe.title || "")
                    setDescription(recipe.description || "")
                    setIngredients(recipe.ingredients || "")
                    setSteps(recipe.steps || "")
                    setPreptime(recipe.prepTime?.toString() || "")
                    setImageUrl(recipe.image || "")
                }
            } catch (error) {
                console.error('error fetching recipe', error)
            }
        }
        fetchRecipe();
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem("token");
        const formData = new FormData()
        
        formData.append("title", title);
        formData.append("description", description);
        formData.append("ingredients", ingredients);
        formData.append("steps", steps);
        formData.append("prepTime", prepTime);

        if (image) {
            formData.append("image", image)
        }

        try {
            const res = await fetch(`https://recipe-api-theta.vercel.app/api/v1/recipe/${id}/update`, {
                method: 'PUT',
                headers: {  
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json()
            
            if (res.ok) {
                setMessage('Recipe updated successfully')
                setTimeout(() => router.push('/dashboard'), 1500)
            } else {
                setMessage(data.message || 'failed to update recipe')
            }
        } catch (error) {
            console.error('update error', error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white ">
            <form className=" p-8 shadow-lg w-full max-w-md " onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-center text-black mb-6">Edit Recipe</h2>
                <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter recipe title" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Enter recipe description" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
                <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} required placeholder="List all Ingredients " className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
                <textarea value={steps} onChange={(e) => setSteps(e.target.value)} required placeholder="List the steps " className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
                <input type='number' value={prepTime} onChange={(e) => setPreptime(e.target.value)} required placeholder="Enter prep time in minutes" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
                
                {imageUrl && (
                    <img src={imageUrl} alt="Recipe" className="w-full h-40 object-cover rounded mb-4" />
                )}
                
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#E6D6CD] text-[#75482F] mb-4"/>
                <button type="submit" className="bg-[#ED6B06] text-black w-full py-2 rounded-lg font-semibold hover:bg-orange-600 transition"> Update Recipe </button>

                {message && (
                    <p className={`mt-4 text-center font-medium ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}

// 2. The default export that wraps everything in Suspense
export default function EditRecipe() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Recipe Data...</div>}>
            <EditRecipeForm />
        </Suspense>
    )
}