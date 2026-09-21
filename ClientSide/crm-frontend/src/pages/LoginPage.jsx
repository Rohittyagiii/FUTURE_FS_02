import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const API_URL = import.meta.env.VITE_API_URL;




const LoginPage = () => {
    const navigate  = useNavigate();
    const gotoDashboard= (page) =>{
      navigate(page);
    }


    
const submitHandler = async(e) => {
  e.preventDefault();
  console.log("data ",e.target)
  const formElement = e.currentTarget.closest("form");
    if (!formElement) return;

    const formData = new FormData(formElement);
  // const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  console.log("payload of login page data", data);
const response = await fetch(`${API_URL}/login-admin`, {
          method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
  console.log("API Response ",result);
  if(result.success){
   toast.success(result.msg ||"User logged In successfully");
      //  e.target.reset();
       gotoDashboard("/dashboard");
  }else{
    toast.error(result.msg);
  }

};




  return (
    <>
      <div className="container-fluid mypage">
        <div className="row">
          <div className="col-12 text-center my-3">
            <h2>ADMIN LOGIN</h2>
          </div>
        </div>
        <div className="row" >
          <div className="col-12 col-md-4 offset-4">
            <form >
              <div className="form text-center mt-3">
                <input
                  className="form-control my-2"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email."
                />
                <input
                  className="form-control my-3"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password."
                />
                <button type="button" className="btn btn-primary" onClick={submitHandler}>
                  LOGIN
                </button>
              </div>
            </form>
          </div>
        </div>
         <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="colored"
              />
      </div>
    </>
  );
};

export default LoginPage;
