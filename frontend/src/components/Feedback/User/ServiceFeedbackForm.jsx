import { useState } from "react";
import Swal from "sweetalert2";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Container } from "reactstrap";
import bg from "../../../Images/feedback.jpeg";
import { useNavigate } from "react-router-dom";

const ServiceFeedbackForm = () => {
  const [UserName, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Rating, setRating] = useState(0);
  const [Comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setNameError("");
    setEmailError("");

    // Validate name
    if (!/^[a-zA-Z ]+$/.test(UserName)) {
      setNameError("Name should contain only letters and spaces");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      setEmailError("Invalid email format");
    }

    // If there are no errors, proceed with form submission
    if (!nameError && !emailError) {
      const ServiceFeedback = { UserName, Email, Rating, Comment };

      const response = await fetch("http://localhost:8070/feedback/service/add", {
        method: "POST",
        body: JSON.stringify(ServiceFeedback),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        Swal.fire({
          title: "Error",
          text: "Cannot add the feedback",
          icon: "error",
        }).then(() => {
          console.log("Cannot add the feedback", error);
        });
      }

      if (response.ok) {
        setName("");
        setEmail("");
        setRating("");
        setComment("");
        setError(null);
        Swal.fire({
          title: "Success",
          text: "Feedback added successfully",
          icon: "success",
        }).then(() => {
          console.log("new feedback added", json);
        });
        navigate("/fbk/servicetable");
      }
    }
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z ]+$/;
    if (!nameRegex.test(name)) {
      setNameError("Name should contain only letters and spaces");
    } else {
      setNameError("");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");


      navigate("/sup");
    }
  };

  const bgStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    height: "100vh",
  };

  return (
    <div className="flex h-full justify-center items-center" style={bgStyle}>
      <div className="bg-black/45 w-1/2 rounded-[50px] py-12 px-14 gap -inset-y-8">
        <div
          className="text-4xl text-white font-bold align-top mb-8"
          style={{ WebkitTextStroke: "1px black" }}
        >
            Give your feedback
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
              <label
                htmlFor="Name"
                className="text-white rounded-xl flex items-center pl-5 font-bold text-2xl"
                style={{ WebkitTextStroke: "1px black" }}
              >
                Full Name:
              </label>
              <input
                type="text"
                id="Name"
                name="name"
                value={UserName}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
                className="w-3/5 bg-white/70 h-14 rounded-xl placeholder-text-black placeholder-font-semibold placeholder-text-lg pl-5 text-xl border-b-2 border-gray-300 focus:outline-none focus:border-green-500"
                required
              />
            </div>
            {nameError && <div className="text-red-500">{nameError}</div>}
            <div className="flex justify-between items-center">
              <label
                htmlFor="Email"
                className="text-white flex items-center pl-5 font-bold text-2xl"
                style={{ WebkitTextStroke: "1px black" }}
              >
                Email Address:
              </label>
              <input
                type="Email"
                id="Email"
                name="Email"
                value={Email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className="w-3/5 bg-white/70 h-14 rounded-xl placeholder-text-black placeholder-font-semibold placeholder-text-lg pl-5 text-xl border-b-2 border-gray-300 focus:outline-none focus:border-green-500"
                required
              />
            </div>
            {emailError && <div className="text-red-500">{emailError}</div>}
            <div className="flex justify-between items-center">
              <label
                htmlFor="rating"
                className="text-white rounded-xl flex items-center pl-5 font-bold text-2xl"
                style={{ WebkitTextStroke: "1px black" }}
              >
                Rate Our service:
              </label>
              {Array(5)
                .fill()
                .map((_, index) =>
                  Rating >= index + 1 ? (
                    <AiFillStar
                      key={index}
                      style={{ color: "orange" }}
                      onClick={() => setRating(index + 1)}
                      className="FillStar cursor-pointer"
                    />
                  ) : (
                    <AiOutlineStar
                      key={index}
                      style={{ color: "orange" }}
                      onClick={() => setRating(index + 1)}
                      className="OutlineStar cursor-pointer"
                    />
                  )
                )}
            </div>
            <div
              className="w-6/7 bg-white/70 h-14 rounded-xl placeholder-text-black placeholder-font-semibold placeholder-text-lg pl-5 text-xl border-b-2 border-gray-300 focus:outline-none focus:border-green-500"
            >
              <textarea
                id="inquiry"
                name="inquiry"
                placeholder="Enter your opinion here"
                value={Comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full max-w-full min-w-full"
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="reset"
                className="bg-blue-500 py-3 px-8 rounded-lg text-lg font-bold hover:bg-blue-700 transition duration-300 mr-20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 py-3 px-8 rounded-lg text-lg font-bold hover:bg-blue-700 transition duration-300"
              >
                Submit
              </button>
            </div>
            {error && <div className="error">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};


export default ServiceFeedbackForm;
