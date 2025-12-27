import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import Button from "../components/Button";

const Dashboard = () => {
  // Redux mathi data lavva mate
  // const { user } = useSelector((state) => state.auth);
  const user=localStorage.getItem("registeredUser")
  const parseduser=JSON.parse(user);
  

  console.log(parseduser.role);
  
  const dispatch = useDispatch();

  //task store
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  //data fetching useeffect
  useEffect(()=>{
    //ahi api calling
    const fetchTasks =()=>{
      setLoading(true);//loader st

      setTimeout(()=>{
        let fetchTasks = [];

        if(parseduser?.role === "Frontend"){
          fetchTasks = ["css", "api integration", "state manage"];
        }else if(parseduser?.role === "Backend"){
          fetchTasks = ["schema", "api", "redux"];
        }else if(parseduser?.role === "FullStack"){
          fetchTasks = ["frontend", "backend", "design"];
        }

        setTasks(fetchTasks);//state update and data save
        setLoading(false);//loading aya band
      },2000);
    }
    if(parseduser){
      fetchTasks();
    }
  },[]);//if user change then code pacho run thase

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- 2. Full Width Header (Container ni bahar) --- */}
      <nav className="bg-blue-600 shadow-md w-full">
        {/* Header ni andar content ne thodu padding apyu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white ">Dashboard</h1>
            <div className="w-32">
              <Button onClick={() => dispatch(logout())} >Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- 3. Main Content Area (Aa Center ma raheshe) --- */}
      <main className="max-w-4xl mx-auto p-8 mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          {user ? (
            <div>
              <h2 className="text-xl mb-4">
                Welcome, <span className="font-bold text-blue-600">{parseduser.username}</span>!
              </h2>
              <p className="mb-6 text-gray-600">
                Role: <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">{parseduser.role}</span>
              </p>

              <h3 className="text-lg font-semibold mb-3">Your Upcoming Tasks:</h3>

              {loading ? (
                <div className="text-center p-8 text-gray-500 animate-pulse bg-gray-50 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <p className="mt-4">Loading tasks data...</p>
                </div>
              ) : tasks.length > 0 ? (
                <ul className="space-y-3">
                  
                  {/* list,key */}
                  {tasks.map((task, index) => (
                    <li key={index} className="flex items-center p-4 bg-gray-50 border border-gray-200  rounded-lg transition-shadow duration-200">
                      <span className="text-gray-700 font-medium">{task}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No tasks found.</p>
              )}
            </div>
          ) : (
            <p className="text-red-500 font-bold text-center">User not found. Please login again.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;