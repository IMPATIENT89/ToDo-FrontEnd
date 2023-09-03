import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function TaskDetail() {
  const { taskId } = useParams(); 
  const [task, setTask] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/tasks/${taskId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTask(data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
      });
  }, [taskId]);

  const handleDeleteTask = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (isConfirmed) {
      fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          setIsDeleted(true);
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
      navigate("/");
      alert("Task Deletion Successfull");
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  function convertToISTCompletedBy(utcDateTime) {
    const utcDate = new Date(utcDateTime);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };

    utcDate.setHours(utcDate.getHours() - 5);
    utcDate.setMinutes(utcDate.getMinutes() - 30);

    const istDateTime = utcDate.toLocaleString("en-IN", options);

    return istDateTime;
  }
  function convertToISTCreatedAt(utcDateTime) {
    const utcDate = new Date(utcDateTime);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };

    const istDateTime = utcDate.toLocaleString("en-IN", options);

    return istDateTime;
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getTimeDifference = (completionTime) => {
    const currentDateTime = new Date();
    const completionDate = new Date(completionTime);
    const differenceInSecondsUCT = (completionDate - currentDateTime) / 1000;
    const differenceInSeconds  = differenceInSecondsUCT - 19800;

    const days = Math.floor(differenceInSeconds / 86400); 
    const hours = Math.floor((differenceInSeconds % 86400) / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds = differenceInSeconds % 60;

    return { days, hours, minutes, seconds };
  };

  return (
    <div>
      <h1 className="text-center mt-3">Task Detail</h1>
      <h2 className=" text-center mt -3">
        {capitalizeFirstLetter(task.title)}
      </h2>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card mt-3 text-center shadow mb-3 ms-2 me-2 bg-white rounded">
              <div className="card-header">
                Task Title: {capitalizeFirstLetter(task.title)}
              </div>
              <div className="card-body">
                <h4 className="card-text">Description: </h4>
                <h5>{capitalizeFirstLetter(task.description)}</h5>
                <p className="card-text mt-3">
                  Task Start Date & Time: {convertToISTCreatedAt(task.created_at)}
                </p>
                <p className="card-text mt-3 mb-3">
                  Task Should be Completed By:{" "}
                  {convertToISTCompletedBy(task.completion_time)}
                </p>
                {task.completed ? (
                  <span className="btn btn-success">
                    Great! Task completed 🎉
                  </span>
                ) : (
                  getTimeDifference((task.completion_time)).days >= 0 && (
                    <div>
                      <p className="btn btn-primary">
                        Time Left:{" "}
                        {getTimeDifference(task.completion_time).days} days,{" "}
                        {getTimeDifference(task.completion_time).hours} hours,{" "}
                        {getTimeDifference(task.completion_time).minutes}{" "}
                        minutes,{" "}
                        {Math.floor(
                          getTimeDifference(task.completion_time).seconds
                        )}{" "}
                        seconds
                      </p>
                      <p className="mt-2">
                        Hurry Up! Complete the taks before deadline ends.
                      </p>
                    </div>
                  )
                )}
                {!task.completed ? (
                  getTimeDifference(task.completion_time).days < 0 && (
                    <p className="btn btn-outline-danger">Task is Overdue</p>
                  )
                ) : (
                  <p className="mt-2">Congrats!!!</p>
                )}
                <br />
                <Link
                  to={`/task/${task.id}/edit`}
                  className="btn btn-secondary me-2 mt-3"
                >
                  Edit
                </Link>
                {!isDeleted && (
                  <button
                    onClick={handleDeleteTask}
                    className="btn btn-danger mt-3"
                  >
                    Delete Task
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <Link to={"/"} className="btn btn-warning">
          Back to Task Listing{" "}
        </Link>
      </div>
    </div>
  );
}

export default TaskDetail;
