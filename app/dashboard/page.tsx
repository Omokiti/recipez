"use client";

import React from 'react';
import { useState,useEffect } from 'react';
import Link from 'next/link'
import Image  from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface User{
username:string
}
interface Recipe{
  id:number,
  title:string
  image:string
}

interface ActivityItem{
id:number,
type:'like' | 'comment'
message:string,
recipeTitle:string,
createdAt:string
}

export default function Dashboard(){
  const[user,setUser]= useState<User|null>(null)
  const [recipes,setRecipes] = useState<Recipe[]>([])
  const [activity,setActivity] = useState<ActivityItem[]>([])
  const [tab, setTab] = useState<"recipes" | "activity">("recipes");
  const[message,setMessage]=useState('')

  useEffect(()=>{
    const token = localStorage.getItem('token')

    if(!token){
      setMessage('yo must be logged in to access the dashboard')
      return
    }
  
    //fetch user and recipes

    const fetchData = async()=>{
      try {
        const user = await fetch('https://recipe-api-theta.vercel.app/api/v1/auth/user',{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });

        const recipe = await fetch('https://recipe-api-theta.vercel.app/api/v1/recipe/my-recipe',{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });

        const activity = await fetch('https://recipe-api-theta.vercel.app/api/v1/recipe/my-activity',{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });

        const userData = await user.json()
        const recipeData = await recipe.json()
        const activityData = await activity.json()

        setUser(userData)
        setRecipes(recipeData.recipes || [])

        const formatted: ActivityItem[] = [];

        // COMMENTS
        if (activityData.comments) {
          activityData.comments.forEach((c: any) =>
            formatted.push({
              id: c.id,
              type: "comment",
              message: `Commented: "${c.text}"`,
              recipeTitle: c.recipe?.title || "Unknown Recipe",
              createdAt: c.createdAt,
            })
          );
        }

        //likes

        if(activityData.likes){
          activityData.likes.forEach((l:any) =>
          formatted.push({
            id: l.id,
              type: "like",
              message: `Liked "${l.recipe?.title}"`,
              recipeTitle: l.recipe?.title || "Unknown Recipe",
              createdAt: l.createdAt,
          })
          )
        }
        // Sort by newest
        formatted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setActivity(formatted);


      } catch (error) {
        setMessage('failed to fetch dashboard data')
      }
    }
    fetchData()
   
  },[])

  const handleDelete= async(id:number)=>{
    const confirmDelete = confirm('Are you sure yow want to delete this recipe?')
    if(!confirmDelete)return;

    const token = localStorage.getItem("token");
 
    try {
      const res = await fetch(`https://recipe-api-theta.vercel.app/api/v1/recipe/${id}/delete`,{
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      if (!res.ok) {
      const text = await res.text();
      console.error("Delete failed:", text);
      return;
       
      }

      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Delete failed",error)
    }

  }
    return(
     <div className='p-6 bg-white text-black min-h-screen'>
      <h1 className='text-xl font-bold 500 text-black'>Dashboard </h1>
      
      { message&& <p className='text-red-300'>{message}</p>}

      {user &&(
        <div className='mt-4'>
          <h2 className='text-xl font-bold 500'>Welcome {user.username}</h2>
        </div>
      )}


          {/* ----------- TABS ----------- */}
      <div className="flex justify-center gap-8 mt-8 border-b pb-2">
        <button
          onClick={() => setTab("recipes")}
          className={`pb-2 ${
            tab === "recipes" ? "border-b-2 border-black font-medium" : ""
          }`}
        >
          Recipes
        </button>

        <button
          onClick={() => setTab("activity")}
          className={`pb-2 ${
            tab === "activity" ? "border-b-2 border-black font-medium" : ""
          }`}
        >
          Activity
        </button>
      </div>



           {/* ----------- RECIPES TAB ----------- */}
      {tab === "recipes" && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Recipes</h3>
          <Link
    href="/recipes/new"
    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
  >
    + Create Recipe
  </Link>
          {recipes.length === 0 ? (
            <p className="text-gray-600 mt-2">No recipes yet. <Link href='/recipes/new' className='text-orange-500'>Create Recipe </Link></p>
          ) : (
            
            <Swiper
        spaceBetween={20}
        slidesPerView={2}
        className="mt-4"
      >
        {recipes.map((recipe) => (
          <SwiperSlide key={recipe.id}>
            <div className="shadow rounded-lg overflow-hidden">
              <Link href={`/recipes/${recipe.id}`}> 
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-40 object-cover"
              />
              <p className="p-2 text-center font-medium">{recipe.title}</p>
              </Link>
              <Link href={`/recipes/${recipe.id}/edit`} className="text-orange-500 text-sm hover:underline">
              Edit
            </Link>
            <button 
       onClick={() => handleDelete(recipe.id)}
         className="text-orange-500 text-sm hover:underline ml-3"
          >
    Delete
  </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
          )}
        </div>
      )}

                  {/* ----------- ACTIVITY TAB ----------- */}
      {tab === "activity" && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Activity</h3>

          {activity.length === 0 ? (
            <p className="text-gray-600 mt-2">No activity yet.</p>
          ) : (
            activity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 mt-3 p-3 "
              >
                <span>{item.type === "like" ? "❤️" : "💬"}</span>

                <div>
                  <p className="font-medium">{item.message}</p>
                  <p className="text-sm text-gray-500">{item.recipeTitle}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

     </div>
    )
}