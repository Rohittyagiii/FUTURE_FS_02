import React from "react";
import "./Home.css";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const submitHandler = async (e)=>{
  e.preventDefault();
  const formData = new FormData(e.target);

  const data = Object.fromEntries(formData.entries());

  console.log(data);

 const response= await fetch("http://localhost:5000/save-client-details",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
     body: JSON.stringify(data)
  });
  const result = await response.json();
  console.log("API Response ",result);
  if(result.success){
    toast.success(result.msg);
    e.target.reset();
  }else{
    toast.error(result.msg);
  }

}

function Home() {
  return (
    <>
      <div className="container-fluid mypage">
        <div className="row">
          <div className="col-12 text-end mt-2">
            <div className="btn btn-success">Admin Login</div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center custom-text">
            <h1 className="display-1">Welcome</h1>
            <h3 className="display-6">To</h3>
            <h3 className="display-6">Our</h3>
            <h3 className="display-6">Web Page</h3>
          </div>
        </div>
        <div className="row">
            <div className="col-12 text-center my-3">
                <h2 className="fw-bold">For Our Services , Please Fill this Form </h2>
            </div>
            <div className="col-12 border col-md-6 offset-3 text-center">
                <form onSubmit={submitHandler}>
                    <input name='name' type="text" className="form-control my-2" placeholder="Enter your Name" />
                    <input name='email' type="email" className="form-control my-2" placeholder="Enter your Email" />
                    <input name='mobile' type="tel" className="form-control my-2" placeholder="Enter your Mobile Number" />
                    <input name='address' type="text" className="form-control my-2" placeholder="Enter your Address" />
                    <input name='description' type="text" className="form-control my-2" placeholder="Enter your Description" />
                    <button type="submit" className="btn btn-primary my-2" >Submit</button>
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
}

export default Home;
