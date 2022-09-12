import "./app.css";
import React, { useState, useEffect } from "react";

const baseUrl = "http://localhost:3001";
function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getTodos();
  }, []);

  const deleteTodo = async (id) => {
    const data = await fetch(baseUrl + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const completeTodo = async (id) => {
    const data = await fetch(baseUrl + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) todo.complete = data.complete;
        return todo;
      })
    );
  };

  const getTodos = () => {
    fetch(baseUrl + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  };

  const addTodo = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    };
    const data = await fetch(baseUrl + "/todo/new", requestOptions).then(
      (res) => res.json()
    );
    setTodos([...todos, data]);
    setShowModal(false);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <h4>Your Todo's</h4>
      <div className="add__todo" onClick={() => setShowModal(true)}>
        +
      </div>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={`todo ${todo.complete && "complete"}`}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>
            <div className="info">
              <div className="text">{todo.text}</div>
              <div className="delete" onClick={() => deleteTodo(todo._id)}>
                x
              </div>
            </div>
          </div>
        ))}

        {showModal && (
          <div className="modal">
            <div className="header__modal">
              Todo: <span onClick={() => setShowModal(false)}>x</span>
            </div>
            <input type="text" onChange={(e) => setText(e.target.value)} />
            <button onClick={() => addTodo()}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
