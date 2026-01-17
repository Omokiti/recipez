import Image from "next/image";

export default function Home() {
  return (
   
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start"> */}
    <section className="relative h-[100vh] w-[100%] bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/fruit.png')" }}
    >
      {/* Overlay for darkening */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to Recipez</h1>
        <p className="text-lg max-w-md mx-auto drop-shadow">
          Discover and share your favorite recipes with the world.
        </p>
      </div> 
    </section>
    
   
      {/* </main> */}
    </div>
  );
}
