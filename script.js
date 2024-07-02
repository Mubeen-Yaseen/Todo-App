const taskform = document.getElementById("task-form");
const opentaskformbtn = document.getElementById("open-task-form-btn")
const closetaskformbtn = document.getElementById("close-task-form-btn")
const addorupdatetaskbtn = document.getElementById("add-or-update-task-btn")
const titleinput = document.getElementById("title-input")
const dateinput = document.getElementById("date-input")
const descriptioninput = document.getElementById("description-input")
const confirmclosedialog = document.getElementById("confirm-close-dialog")
const discardbtn = document.getElementById("discard-btn")
const taskscontainer = document.getElementById("tasks-container")

let editIndex = -1; 

const reset = () => {
    titleinput.value = "";
    dateinput.value = "";
    descriptioninput.value = "";
    editIndex = -1; 
    addorupdatetaskbtn.innerHTML = "Add Task"; 
}

const storearrdata = (data) => {
    localStorage.setItem("setarr", JSON.stringify(data))
}

const getarraydata = () => {
    return JSON.parse(localStorage.getItem("setarr")) || [];
}

let storedata = [];
storedata = getarraydata();

const Bydefaultshow = () => {
    taskscontainer.innerHTML = ""; 

    // By using Destructuring in forEach loop
    storedata.forEach(({ title, date, description }, index) => {
        const creatediv = document.createElement("div");
        creatediv.id = "showitems";
        creatediv.innerHTML = `
        <p><b>Title: </b>${title}</p>
        <p><b>Date: </b>${date}</p>
        <p><b>Description: </b>${description}</p>
        <div id="editdeletebtn">
        <button class="btn" id="edit-btn" data-index="${index}">Edit Task</button>
        <button class="btn" id="delete-btn" data-index="${index}">Delete</button> 
        </div>
        `;
        taskscontainer.appendChild(creatediv);
    })
    // Add event listeners for delete buttons
    const deletebuttons = taskscontainer.querySelectorAll("#delete-btn")
    deletebuttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index")
            storedata.splice(index, 1)
            storearrdata(storedata)
            Bydefaultshow();
        })
    })
    // Add event listeners for edit buttons
    const editbuttons = taskscontainer.querySelectorAll("#edit-btn");
    editbuttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            const task = storedata[index];
            titleinput.value = task.title;
            dateinput.value = task.date;
            descriptioninput.value = task.description;
            editIndex = index;
            taskform.classList.remove("hidden");
            addorupdatetaskbtn.innerHTML = "Update Task";
        });
    });
}

const showtask = () => {
    let title = titleinput.value.trim()
    let date = dateinput.value.trim()
    let description = descriptioninput.value.trim()

    const allFieldsFilled = title && date && description;
    const isDuplicate = storedata.some((task, index) =>
        task.title === title && task.date === date && task.description === description && index !== editIndex
    );

    if (allFieldsFilled && !isDuplicate) {
        if (editIndex >= 0) {
            // Update the existing task
            storedata[editIndex] = { title, date, description };
        } else {
            // Add a new task       
            storedata.push({ title, date, description });
        }
        storearrdata(storedata);
    }
    Bydefaultshow();
    reset(); // Reset the form and state after adding/updating
}

// Add New Task Button
opentaskformbtn.addEventListener("click", () => {
    taskform.classList.toggle("hidden");
    reset();
})

// close-icon inside the form
closetaskformbtn.addEventListener("click", () => {
    const anytextinput = titleinput.value || dateinput.value || descriptioninput.value
    if (anytextinput) {
        confirmclosedialog.showModal();
    } else {
        taskform.classList.toggle("hidden");
    }
})

// Discard button in Modal 
discardbtn.addEventListener("click", () => {
    taskform.classList.toggle("hidden");
    reset();
})

// Add Task button Inside the Form
addorupdatetaskbtn.addEventListener("click", (e) => {
    e.preventDefault();
    showtask();
    taskform.classList.toggle("hidden");
})

Bydefaultshow();
