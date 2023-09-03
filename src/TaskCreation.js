// In your React component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TaskCreation.css";

function TaskCreation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completion_time, setCompletion_time] = useState("");

  const navigate = useNavigate();

  const getCurrentDateTimeString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        completed: false,
        completion_time,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("New task created successfully.");
      });

    setTitle("");
    setDescription("");
    setCompletion_time("");
    navigate('/');
  };

  return (
    <section className="TaskCreation">
      <h2 className="text-center text-light">Create a New Task</h2>
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <form onSubmit={handleSubmit}>
              <div className="form-group row justify-content-center mt-3">
                <label className="col-6 col-form-label text-dark">
                  Title:
                  <div className="col-lg-12">
                    <input
                      className="form-control shadow mb-4 bg-white rounded"
                      required
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter the task title"
                    />
                  </div>
                </label>
              </div>
              <div className="form-group row justify-content-center mt-3">
                <label className="col-6 col-form-label text-dark">
                  Description:
                  <div className="col-lg-12">
                    <textarea
                      className="form-control shadow mb-4 bg-white rounded"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write description for the task"
                    />
                  </div>
                </label>
              </div>
              <div className="form-group row justify-content-center mt-3">
                <label className="col-6 col-form-label text-dark">
                  Completion Time:
                  <div className="col-lg-12">
                    <input
                      required
                      type="datetime-local"
                      className="form-control shadow mb-4 bg-white rounded"
                      value={completion_time}
                      onChange={(e) => setCompletion_time(e.target.value)}
                      min={getCurrentDateTimeString()}
                      placeholder="Select a date and time for task completion"
                    />
                  </div>
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                Create Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TaskCreation;
