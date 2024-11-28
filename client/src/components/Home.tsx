import Preview from '../assets/Untitled design(4).png';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const tokenauth = localStorage.getItem("tokenauth");
  let isAuthenticated = false;

  if (tokenauth) {
    try {
      // Decode token to check expiration
      const decodedToken = jwtDecode(tokenauth);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp > currentTime) {
        // Token is valid
        isAuthenticated = true;
      } else {
        // Token is expired; clear token
        localStorage.removeItem("tokenauth");
        isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem("tokenauth");
      isAuthenticated = false;
    }
  }

  if (isAuthenticated) {
    return (
      <main className="flex flex-col bg-white">
        <section className="w-full homenav container mx-auto px-3 flex items-center justify-center">
          <div className="flex mobile items-center justify-center">
            <div className='flex flex-col mmobile'>
              <div>
                <h1 className="text-2xl mb-5 font-bold text-black">Welcome to {import.meta.env.VITE_WEB_NAME}</h1>
                <h1 className="text-md mb-5 text-black text-justify">Welcome to {import.meta.env.VITE_WEB_NAME} – your simple, powerful tool for organizing life’s tasks. Manage, prioritize, and accomplish your goals with ease. Whether it's for work, home, or personal projects, our intuitive to-do list platform is designed to keep you on track and stress-free. Let's turn plans into progress, one task at a time!</h1>
              </div>
            </div>
            <img src={Preview} alt="To-Do List" className="h-96 w-full" />
          </div>
        </section>
      </main >
    )
  } else {
    return (
      <main className="flex flex-col bg-white">
        <section className="w-full homenav container mx-auto px-3 flex items-center justify-center">
          <div className="flex mobile items-center justify-center">
            <div className='flex flex-col mmobile'>
              <div>
                <h1 className="text-2xl mb-5 font-bold text-black">Welcome to {import.meta.env.VITE_WEB_NAME}</h1>
                <h1 className="text-md mb-5 text-black text-justify">Welcome to {import.meta.env.VITE_WEB_NAME} – your simple, powerful tool for organizing life’s tasks. Manage, prioritize, and accomplish your goals with ease. Whether it's for work, home, or personal projects, our intuitive to-do list platform is designed to keep you on track and stress-free. Let's turn plans into progress, one task at a time!</h1>
                <div>
                  <a href="/signup" className="text-white text-center bgmain rounded-md px-4 py-3 text-md font-medium hover:bg-gray-700">Sign up</a>
                </div>
              </div>
            </div>
            <img src={Preview} alt="To-Do List" className="h-96 w-full" />
          </div>
        </section>
      </main >
    )
  }
}
