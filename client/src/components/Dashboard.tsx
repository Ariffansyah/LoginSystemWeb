import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      <main>
        <section>
          <div className="flex flex-row justify-start items-start">
            {isSidebarOpen && (
              <div className="bgmain w-64 homenav" id="sidebar">
                <div className="flex flex-col justify-center items-center w-1/3 mt-10">
                  <div>
                    <p className="text-white ml-5">List</p>
                  </div>
                  <div className="mt-5">
                    <p className="text-white ml-5">List1</p>
                  </div>
                </div>
              </div>
            )}
            <div className={`bg-white ${isSidebarOpen ? 'w-full' : 'w-full'} homenav`}>
              <button
                onClick={toggleSidebar}
                className="px-4 py-2 bgmain text-white rounded-br-md hover:bg-gray-700 transition">
                open
              </button>
              <div className="flex justify-center items-center p-2">
                <h1 className="text-2xl font-bold">Dashboard</h1>
              </div>
            </div>
          </div>
        </section>
      </main>
    );

  } else {
    window.location.href = "/login";
  }
}
