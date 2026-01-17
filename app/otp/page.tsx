"use client";

import React, { useState,useRef } from "react"
import { useSearchParams,useRouter } from "next/navigation";

export default function Otp(){
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
   
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    const router = useRouter()

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next box automatically
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if(!email){
      alert('email missing.Please return to previous page')
      return;
    }
    console.log("OTP Entered:", code);

    try {
      const response= await fetch('https://recipe-api-theta.vercel.app/api/v1/auth/verify-otp',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          email,
          otp:code
        })
      })
      
      const data = await response.json()
      if(!response.ok){
        alert(data.message || "Invalid OTP");
        return;

      }
      router.push("/login");
      console.log('otp verification result:',data)
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  
  
  };

    return(
        <div className="flex items-center justify-center  bg-[#E7D2C8]">
            <div className="w-full min-h-screen">
                <h2 className="text-2xl font-bold text-center text-black pt-6">Enter Verification Code</h2>
                <p className="text-center text-black text-sm mb-6">Please enter the 6 digit code sent to your email address to verify your account</p>

        {email && (
          <p className="text-center text-black text-sm mb-6">
            A 6-digit code was sent to <span className="font-semibold">{email}</span>
          </p>
        )}
                <div className="flex justify-center mb-6 gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              // ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-lg "
            />
          ))}
        
        </div>
        <div className="flex justify-center">
        <button  onClick={handleSubmit}className="bg-[#ED6B06] text-black w-20 rounded-lg font-semibold hover:bg-orange-600 transition py-2 mx-auto" >Verify</button>
        </div>
      
            </div>
          
        </div>
    )

}