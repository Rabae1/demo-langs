window.addEventListener("DOMContentLoaded", function () {
    const todoForm = document.getElementById("todo-form");
    const tasksContainer = document.getElementById("tasks"); // تم تغيير المعرف هنا
    
    // استرجاع المهام المخزنة عند تحميل الصفحة
    let tasks = [];
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    
    // عرض المهام إذا كنا في صفحة MyList
    if (tasksContainer) {
        displayTasks();
    }
    
    // إضافة مستمع الحدث للنموذج إذا كان موجوداً
    if (todoForm) {
        todoForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const taskName = document.getElementById("name-task").value;
            const taskDescription = document.getElementById("description-task").value;
            const dueDate = document.getElementById("due-date-task").value;
            const condition = document.getElementById("condition-task").value;

            if (!taskName || !taskDescription || !dueDate || !condition) {
                alert("Please fill in all fields.");
                return;
            }

            const task = {
                id: Date.now().toString(), // تم تغيير المعرف ليكون نصاً بدلاً من رقم
                name: taskName,
                description: taskDescription,
                dueDate: dueDate,
                condition: condition
            };

            // استرجاع أحدث المهام من localStorage قبل الإضافة
            const latestTasks = localStorage.getItem('tasks');
            if (latestTasks) {
                tasks = JSON.parse(latestTasks);
            }

            // إضافة المهمة إلى المصفوفة
            tasks.push(task);
            
            // تخزين المهام في localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // عرض جميع المهام إذا كان tasksContainer موجوداً
            if (tasksContainer) {
                displayTasks();
            }
            
            // إعادة تعيين النموذج
            todoForm.reset();

            console.log("New Task Added:", task);
            alert("تمت إضافة المهمة بنجاح!");
        });
    }
    
    // دالة لعرض جميع المهام
    function displayTasks() {
        if (!tasksContainer) return;
        
        tasksContainer.innerHTML = ''; // مسح العرض الحالي أولاً
        
        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<div class="no-tasks">there are no tasks currently.</div>';
            return;
        }
        
        // تم تغيير طريقة عرض المهام لتكون كل مهمة عنصر منفصل داخل حاوية المهام
        tasks.forEach((task, index) => {
            // التأكد من أن كل مهمة لديها معرف فريد
            if (!task.id) {
                task.id = `task_${index}_${Date.now()}`;
            }
            
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.dataset.id = task.id;
            
            taskElement.innerHTML = `
                <h3>${task.name}</h3>
                <p>${task.description}</p>
                <p>Due: ${task.dueDate}</p>
                <select class="status-select" onchange="updateTaskStatus(this, '${task.id}')">
                    <option value="Not-Started" ${task.condition === 'Not-Started' ? 'selected' : ''}>Not Started</option>
                    <option value="In-Progress" ${task.condition === 'In-Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${task.condition === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
            `;
            
            tasksContainer.appendChild(taskElement);
        });
        
        // تحديث المهام في localStorage بعد التأكد من وجود معرفات
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});

// دالة لتحديث حالة المهمة
function updateTaskStatus(selectElement, taskId) {
    const newStatus = selectElement.value;
    let tasks = [];
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        const taskIndex = tasks.findIndex(task => task.id == taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].condition = newStatus;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            console.log(`Task ${taskId} status updated to: ${newStatus}`);
        }
    }
}

// دالة لحذف المهمة - تم تحسينها
function deleteTask(taskId) {
    console.log("Attempting to delete task with ID:", taskId);
    
    let tasks = [];
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        console.log("Current tasks:", tasks);
        
        // البحث عن المهمة بالمعرف
        const taskIndex = tasks.findIndex(task => String(task.id) === String(taskId));
        console.log("Task index:", taskIndex);
        
        if (taskIndex !== -1) {
            // حذف المهمة من المصفوفة
            tasks.splice(taskIndex, 1);
            
            // تحديث localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
            console.log("Tasks after deletion:", tasks);
            
            // تحديث العرض
            const tasksContainer = document.getElementById("tasks");
            if (tasksContainer) {
                // إعادة عرض جميع المهام
                tasksContainer.innerHTML = '';
                
                if (tasks.length === 0) {
                    tasksContainer.innerHTML = '<div class="no-tasks">there are no tasks currently.</div>';
                } else {
                    tasks.forEach((task, index) => {
                        // التأكد من أن كل مهمة لديها معرف فريد
                        if (!task.id) {
                            task.id = `task_${index}_${Date.now()}`;
                        }
                        
                        const taskElement = document.createElement('div');
                        taskElement.className = 'task';
                        taskElement.dataset.id = task.id;
                        
                        taskElement.innerHTML = `
                            <h3>${task.name}</h3>
                            <p>${task.description}</p>
                            <p>Due: ${task.dueDate}</p>
                            <select class="status-select" onchange="updateTaskStatus(this, '${task.id}')">
                                <option value="Not-Started" ${task.condition === 'Not-Started' ? 'selected' : ''}>Not Started</option>
                                <option value="In-Progress" ${task.condition === 'In-Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Completed" ${task.condition === 'Completed' ? 'selected' : ''}>Completed</option>
                            </select>
                            <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
                        `;
                        
                        tasksContainer.appendChild(taskElement);
                    });
                }
            }
            
            console.log(`Task ${taskId} deleted successfully`);
        } else {
            console.error(`Task with ID ${taskId} not found`);
        }
    }
}
