

const data = document.getElementById("paragraph");


const userInfo = document.getElementById('user-info');
const profileBox = document.getElementById('profile-box');
const closeProfile = document.getElementById('close-profile');

userInfo.addEventListener('click', function () {
  profileBox.classList.add('open');
});

closeProfile.addEventListener('click', function () {
  profileBox.classList.remove('open');
});

document.addEventListener("click", function (event) {
  // console.log(event.target)
  if (!profileBox.contains(event.target) && !userInfo.contains(event.target)) {
    profileBox.classList.remove("open")
  }
})

async function logout() {
  const response = await axios.post("http://localhost:9000/cookie-clear")
  console.log(response.data.msg)
  window.location.href = "http://localhost:9000/signIN"
}


let id_no = 0;
let todo = [];

async function fetchUsername() {
  try {
    const response = await axios.get(
      "http://localhost:9000/todo-user-info",
      {},
      {
        withCredentials: true,
      }
    );
    console.log(response)
    const usernameInfo = response.data.username;
    document.getElementById("username").innerText = usernameInfo;
    document.getElementById("list-user").innerText = usernameInfo;
  } catch (err) {
    console.log("Error fetching user info:", err);
  }
}
window.onload = function () {
  fetchUsername();
};

function addTodo() {
  const user = document.getElementById("todo-input");
  const userinput = user.value;
  if (!userinput) {
    userinput.placeholder = "Enter Somthing"
  } else {
    addid();
    todo.push({
      id: id_no,
      title: userinput,
      completed: false
    });
    addText();
    user.value = "";
  }

}

function addid() {
  id_no++;
}

function addText() {
  const getData = todo.map((req) => req.title);
  let innerValue = "";
  for (let i = 0; i < getData.length; i++) {
    const findId = todo.filter((req) => req.title === getData[i]);
    console.log(findId);
    const id__title = findId[0].id;
    innerValue += `
      <div class="task-item">
    <input type="checkbox" id="task-${id__title}" class="task-checkbox" onchange="toggleTask(${id__title})">
    <label for="task-${id__title}" class="task-text" id="text-data${id__title}">${getData[i]}</label>
    <div class="task-buttons">
      <button class="edit-btn" onclick="editTask(${id__title})" aria-label="Edit task">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
        </svg>
      </button>
      <button class="delete-btn" onclick="deleteTask(${id__title})" aria-label="Delete task">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
        </svg>
      </button>
    </div>
  </div>
    `;
  }
  data.innerHTML = innerValue;
}

// In order to checkbox and display it

// function toggleTask(id) {
//   const taskItem = document.getElementById(`text-data${id}`);
//   const data = todo.find(req => req.id === id)
//   if (data) {
//     data.completed = !data.completed

//     if (data.completed) {
//       taskItem.classList.add("task-completed")
//       console.log("task done")
//     } else {
//       taskItem.classList.remove("task-completed")
//       console.log("task undone")

//     }
//   }
//   console.log(data.completed)
// }

// same functionality using map
function toggleTask(id) {
  const taskItem = document.getElementById(`text-data${id}`);
  todo=todo.map(req=>{
    if(req.id===id){
      req.completed = !req.completed
        if (req.completed) {
          taskItem.classList.add("task-completed")
          console.log("task done")
        } else {
          taskItem.classList.remove("task-completed")
          console.log("task undone")
      }
      console.log(req.completed)
    }
    return req
  })
  
}



function deleteTask(element) {
  const data = element;
  todo = todo.filter((req) => req.id !== data);
  addText();
}
function editTask(element) {
  let userChange = prompt("Edit the task");
  const datavalue = element;
  todo = todo.map((data) => {
    if (data.id === datavalue) {
      return { ...data, title: userChange };
    }
    return data;
  });
  addText();
}