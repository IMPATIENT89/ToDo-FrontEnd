import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function TaskUpdate() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    completion_time: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        // After successful update, navigate back to the task detail page
        navigate(`/`);
        alert("Task Updated Successfully");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  if (!task.title) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-center mt-3">Update Your Task</h1>
      <div className="container mt-3 text-center">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <form onSubmit={handleSubmit}>
              <div className="form-group row justify-content-center mt-3">
                <label
                  htmlFor="title"
                  className="col-2 col-form-label text-dark"
                >
                  Title:
                </label>
                <div className="col-lg-6">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    className="form-control shadow mb-4 bg-white rounded"
                  />
                </div>
              </div>
              <div className="form-group row justify-content-center mt-3">
                <label
                  htmlFor="description"
                  className="col-2 col-form-label text-dark"
                >
                  Description:
                </label>
                <div className="col-lg-6">
                  <textarea
                    id="description"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    className="form-control shadow mb-4 bg-white rounded"
                  />
                </div>
              </div>
              <div className="form-group row justify-content-center mt-3">
                <label
                  htmlFor="description"
                  className="col-2 col-form-label text-dark"
                >
                  Completion Time:
                </label>
                <div className="col-lg-6">
                  <input
                    id="completion_time"
                    type="datetime-local"
                    name="completion_time"
                    value={task.completion_time}
                    onChange={handleChange}
                    className="form-control shadow mb-4 bg-white rounded"
                  />
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-success">
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <Link to={"/"} className="btn btn-warning">
          Back to Task Listing{" "}
        </Link>
      </div>
    </div>
  );
}

export default TaskUpdate;
