import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Rainfall.css";

function TaskListing() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data.reverse());
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleTaskCompletionChange = (taskId, completed) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed } : task
    );
    setTasks(updatedTasks);

    fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }), 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        alert("Great Work! You completed you task.");
      })
      .catch((error) => {
        alert("Error while updating");
      });
  };
  function convertToIST(utcDateTime) {
    const utcDate = new Date(utcDateTime);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    const istDateTime = utcDate.toLocaleString("en-IN", options);

    return istDateTime;
  }

  const getTimeDifference = (completionTime) => {
    const currentDateTime = new Date();
    const completionDate = new Date(completionTime);
    
    console.warn(currentDateTime);
    const differenceInSecondsUCT = (completionDate - currentDateTime) / 1000;
    const differenceInSeconds = differenceInSecondsUCT - 19800;

    const days = Math.floor(differenceInSeconds / 86400); 
    const hours = Math.floor((differenceInSeconds % 86400) / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds = differenceInSeconds % 60;

    return { days, hours, minutes, seconds };
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div>
      <h1 className="text-center">Your Tasks</h1>
      <div className="col-lg-12">
        <div className="container">
          <div className="row justify-content-center">
            {tasks.map((task) => (
              <div className="col-lg-4" key={task.id}>
                <div className="card text-center shadow mb-3 ms-2 me-2 bg-white rounded">
                  <div className="card-header">
                    Task Started on: {convertToIST(task.created_at)}
                  </div>
                  <div className="card-body">
                    <h4 className="card-text">
                      Title: {capitalizeFirstLetter(task.title)}
                    </h4>
                    <h5 className="card-text">
                      {task.description.length > 6
                        ? `${task.description.substring(0, 6)}...`
                        : task.description}
                    </h5>
                  </div>

                  <div className="card-body">
                    <p className="card-text">
                      {task.completed ? (
                        <span className="btn btn-success">
                          Great! Task completed 🎉
                        </span>
                      ) : (
                        getTimeDifference(task.completion_time).days >= 0 && (
                          <span className="btn btn-primary">
                            Time Left:{" "}
                            {getTimeDifference(task.completion_time).days} days,{" "}
                            {getTimeDifference(task.completion_time).hours}{" "}
                            hours,{" "}
                            {getTimeDifference(task.completion_time).minutes}{" "}
                            minutes,{" "}
                            {Math.floor(
                              getTimeDifference(task.completion_time).seconds
                            )}{" "}
                            seconds
                          </span>
                        )
                      )}
                    </p>
                    <p className="card-text">
                      {!task.completed ? (
                        getTimeDifference(task.completion_time).days < 0 && (
                          <span className="btn btn-danger">
                            Task is Overdue
                          </span>
                        )
                      ) : (
                        <span>Congrats!!!</span>
                      )}
                    </p>

                    <h5>
                      <Link to={`/task/${task.id}`}>View</Link>
                    </h5>
                  </div>
                  <div className="card-footer">
                    <label>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleTaskCompletionChange(task.id, !task.completed)
                        }
                        checked={task.completed}
                      />
                      <p className="text-lead me-2">Completed</p>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskListing;
