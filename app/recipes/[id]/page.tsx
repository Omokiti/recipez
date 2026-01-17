
"use client"


import { useParams } from "next/navigation"
import {useEffect,useState}  from "react"

interface Comment {
    id: number;
    text: string;
    createdAt: string;
    user: {
      username: string;
    };
  }
  



interface Recipe{
id:number,
title:string
image:string
description: string;
ingredients: string[];
steps: string[];
comments: Comment[];
}


export default function RecipeDetails(){
    const{id} = useParams()
    const[recipe,setRecipe]=useState<Recipe|null>(null)
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
       const fetchRecipe=async()=>{


       }
        
    },[id])

 if(!recipe) return <p>Loading..</p>

  return(
    <div className="max-w-3xl mx-auto p6">
        <img src={recipe.image}/>

    </div>
  )

}