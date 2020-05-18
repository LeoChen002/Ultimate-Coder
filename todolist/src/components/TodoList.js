import React, { Component } from "react";

export default class TodoList extends Component {
  state = {
    todos: [],
    title: "",
    counter: 1,
    currentShowList: "process",
    tempPri: "",
    tempTitle: "",
    searchInput: "",
  };

  //Dong

  handleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleSubmit = () => {
    let newTodo = {
      id: this.state.counter,
      title: this.state.title,
      completed: false,
      isInEdit: false,
    };
    let newState = {
      todos: [...this.state.todos, newTodo],
      title: "",
      counter: this.state.counter + 1,
    };
    this.setState(newState);
  };

  handleDelete = (id) => {
    let newTodo = this.state.todos.filter((todo) => todo.id !== id);
    this.setState({ todos: newTodo });
  };

  handleComplete = (id) => {
    let newTodo = this.state.todos.map((todo) =>
      todo.id === id
        ? {
            id: todo.id,
            title: todo.title,
            completed: !todo.completed,
            isInEdit: todo.isInEdit,
          }
        : todo
    );
    this.setState({ todos: newTodo });
  };

  handleEdit = (id) => {
    //console.log(id)
    let newTodo = this.state.todos.map((todo) =>
      todo.id === id
        ? {
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
            isInEdit: true,
          }
        : todo
    );
    this.setState({ todos: newTodo });
  };

  handleTempPri = (e) => {
    this.setState({ tempPri: e.target.value });
  };

  handleTempTitle = (e) => {
    this.setState({ tempTitle: e.target.value });
  };

  editPri = (index, todo) => {
    if (todo.isInEdit) {
      return (
        <input
          type="number"
          placeholder={index}
          onChange={this.handleTempPri}
        />
      );
    } else {
      return index;
    }
  };

  editTitle = (todo) => {
    if (todo.isInEdit) {
      return (
        <input
          type="text"
          placeholder={todo.title}
          onChange={this.handleTempTitle}
        />
      );
    } else
      return (
        <div
          style={{ textDecoration: todo.completed ? "line-through" : "" }}
          onClick={() => this.handleComplete(todo.id)}
        >
          {todo.title}
        </div>
      );
  };

  handleCancel = (id) => {
    let newTodo = this.state.todos.map((todo) =>
      todo.id === id
        ? {
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
            isInEdit: !todo.isInEdit,
          }
        : todo
    );
    this.setState({ todos: newTodo, tempPri: "", tempTitle: "" });
  };

  handleSave = (todo) => {
    let tempPri = this.state.tempPri;
    let tempTitle = this.state.tempTitle;
    if (tempTitle === "") {
      tempTitle = todo.title;
    }
    let tempTodo = null;
    let index = null;
    let newTodo = this.state.todos.map((item, i) => {
      if (item.id === todo.id) {
        tempTodo = {
          id: item.id,
          title: tempTitle,
          completed: item.completed,
          isInEdit: false,
        };
        index = i;
        return tempTodo;
      } else {
        return item;
      }
    });
    if (tempPri !== "") {
      newTodo.splice(index, 1);
      newTodo.splice(tempPri - 1, 0, tempTodo);
    }
    console.log({ todos: newTodo, tempPri: "", tempTitle: "" });
    this.setState({ todos: newTodo, tempPri: "", tempTitle: "" });
  };

  handleSearch = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  btnSaveAndCancel = (todo) => {
    if (todo.isInEdit) {
      return (
        <div>
          <button onClick={() => this.handleSave(todo)}>save</button>
          <button onClick={() => this.handleCancel(todo.id)}>cancel</button>
        </div>
      );
    } else {
      return <button onClick={() => this.handleEdit(todo.id)}>Edit</button>;
    }
  };

  btnDel = (todo) => {
    if (todo.isInEdit) {
      return <div />;
    } else {
      return <button onClick={() => this.handleDelete(todo.id)}>Delete</button>;
    }
  };

  renderTodos = (todos) => {
    let newTodos = todos.map((todo) => {
      let index = null;
      this.state.todos.forEach((item, i) => {
        if (todo === item) {
          index = i;
        }
      });
      //console.log(todo);
      return (
        <div style={{ display: "flex" }} key={todo.id}>
          <div style={{ paddingRight: "10px" }}>
            {this.editPri(index + 1, todo)}
          </div>
          <div
            style={{
              paddingRight: "10px",
            }}
          >
            {this.editTitle(todo)}
          </div>
          {this.btnSaveAndCancel(todo)}
          {this.btnDel(todo)}
        </div>
      );
    });
    return newTodos;
  };

  showTodo = () => {
    let tempTodos = [];
    if (this.state.currentShowList === "process") {
      tempTodos = this.state.todos.filter((todo) => todo.completed === false);
    } else if (this.state.currentShowList === "done") {
      tempTodos = this.state.todos.filter((todo) => todo.completed);
    } else tempTodos = this.state.todos;

    let newTodos;

    if (this.state.searchInput === "") {
      newTodos = this.renderTodos(tempTodos);
      //console.log(newTodos);
    } else {
      let tempSearchTodo = tempTodos.filter((todo) =>
        todo.title.includes(this.state.searchInput)
      );

      newTodos = this.renderTodos(tempSearchTodo);
      //console.log(newTodos);
    }
    return newTodos;
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  };

  render() {
    const { title } = this.state;
    //console.log(this.state);
    return (
      <div>
        <input
          onKeyPress={this.handleKeyPress}
          value={title}
          onChange={this.handleChange}
          placeholder="Add Todo"
        />
        <button onClick={this.handleSubmit}>Submit</button>
        <div>
          <button
            style={{
              color: this.state.currentShowList === "process" ? "red" : "black",
            }}
            onClick={() => this.setState({ currentShowList: "process" })}
          >
            process
          </button>
          <button
            style={{
              color: this.state.currentShowList === "done" ? "red" : "black",
            }}
            onClick={() => this.setState({ currentShowList: "done" })}
          >
            done
          </button>
          <button
            style={{
              color: this.state.currentShowList === "all" ? "red" : "black",
            }}
            onClick={() => this.setState({ currentShowList: "all" })}
          >
            all
          </button>
        </div>
        {this.showTodo()}
        <div>
          <input placeholder="search" onChange={this.handleSearch} />
        </div>
      </div>
    );
  }
}
