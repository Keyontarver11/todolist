window.onload = function() {
  const todosContainer = document.getElementById("display");
  const createTodo = document.getElementById("tasklist");
  const addButton = document.getElementById("addbutton");
  const textinput = document.createElement("input");
  var error = error;

  createTodo.onkeydown = function(e) {
    if (e.keyCode === 13) {
      create();
    }
  };
  textinput.value.onkeydown = function(e) {
    if (e.keyCode === 13) {
      editTodo();
    }
  };

  addButton.onclick = function(e) {
    create();
  };

  fetch("/get-todos")
    .then(response => response.json())
    .then(response => {
      // console.log(response);

      response.forEach(todo => {
        insertTodo(todo);
      });
    });

  function insertTodo(todo) {
    let container = document.createElement("div");
    container.id = todo.id;
    container.classList.add("todo");
    const textinput = document.createElement("input");
    const editbtn = document.createElement("button");
    editbtn.id = "editbtn-" + textinput;
    editbtn.innerHTML = "+";
    editbtn.onclick = function(e) {
      console.log("edit " + textinput)
      console.log(editTodo())
      editTodo();
    }



    let text = document.createElement("div");
    text.innerHTML = todo.text;
    
    
    text.onclick = function(e) {
      container.appendChild(textinput)
      container.appendChild(editbtn)
    };
    
      
    

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "checkbox-" + todo.id;
    checkbox.checked = todo.completed;
    checkbox.onchange = function(e) {
      console.log("check box " + todo.id + " click");
      console.log(checkbox.checked);

      updateTodo(todo.id, checkbox.checked, todo.text);
    };

    // text.classList.add('edit');

    const btn = document.createElement("button");
    btn.id = "btn-" + todo.id;
    btn.innerHTML = "X";
    btn.onclick = function(e) {
      console.log("deleting " + todo.id);

      fetch("/delete", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          id: todo.id
        })
      })
        .then(response => response.json())
        .then(response => {
          // console.log(response);
          if (response.affectedRows) {
            container.remove();
          }
        })
        .catch(error => console.error(error));
    };

    container.appendChild(checkbox);
    container.appendChild(text);
    container.appendChild(btn);

    todosContainer.appendChild(container);
  }

  function create() {
    // console.log('add todo');
    if (createTodo.value) {
      fetch("/create-todo", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          text: createTodo.value
        })
      })
        .then(response => response.json())
        .then(response => {
          // console.log(response);
          if (response.affectedRows) {
            insertTodo({
              id: response.insertId,
              text: createTodo.value,
              completed: false,
              created: response.created
            });
            createTodo.value = "";
          } else {
            alert("Could not create");
          }
        })
        .catch(error => console.error(error));
    } else {
      alert("You can not create a todo without text");
    }
  }

  function updateTodo(id, completed, text) {
    fetch("/update-todo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
        text: text,
        completed: completed
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(error => console.error(error));
  }
  const todo = 
  function editTodo(){
    console.log('its working')
    
    updateTodo(todo.id,todo.completed, text.value);
  }
};
