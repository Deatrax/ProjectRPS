for the database, I  was thinking we can have a tasks table, cources table, materials table and then link them up. but then I  realized that this is not RDBMS and MongoDB is NoSQL then how are we suppsoed to achieve this and what would be the proper architectural design of the database 

Gemini:
It is a common misconception that because MongoDB is "NoSQL," you should never split data into separate collections (tables).

For **Project RPS**, your RDBMS intuition is actually **100% correct**.

Because your Dashboard needs to query "All Tasks" sorted by date (regardless of course) and "All Materials" for a specific course, **Referencing (similar to SQL Foreign Keys)** is the proper architectural design. If you tried to embed everything inside a User document, you would end up with a nightmare when trying to filter or sort tasks.

Here is the **proper database architecture** for your MERN stack application:

### 1. The Architectural Diagram (The "Schema Map")

Instead of SQL `JOINs`, Mongoose uses `ref` (References) and `.populate()`.

* **User Collection:** The central hub.
* **Task Collection:** Links to User + (Optional) Course.
* **Course Collection:** Links to User.
* **Material Collection:** Links to Course.

```text
[ User ]
  |__ _id
  |__ name, email, password
  |__ currentPainScore
  |
  |--- (Has Many) ---> [ Task ]
  |                      |__ _id
  |                      |__ user (ref: User)      <-- Link back to User
  |                      |__ course (ref: Course)  <-- Link to Course (Optional)
  |                      |__ title, deadline, difficulty, weight
  |
  |--- (Has Many) ---> [ Course ]
  |                      |__ _id
  |                      |__ user (ref: User)      <-- Link back to User
  |                      |__ courseCode (e.g. "CSE 4550")
  |                      |__ color (for the UI)
  |
  |--- (Has Many) ---> [ Material ]
                         |__ _id
                         |__ course (ref: Course)  <-- Link to Course
                         |__ title (e.g. "Lab 01 Manual")
                         |__ fileLink (URL to PDF)

```

---

### 2. Why This is the "Right" Way (NoSQL vs. RDBMS)

You might ask: *"Why not just put the tasks inside the Course document?"*

1. **The Dashboard Requirement:** Your Dashboard needs a **Timeline View** of *all* tasks sorted by deadline.
* **If Embedded:** You would have to fetch *every* course, extract their tasks arrays, merge them in JavaScript, and then sort them. That is slow and complex.
* **If Separate Collection (Your Plan):** You simply run: `Task.find({ user: uid }).sort({ deadline: 1 })`. Fast and clean.


2. **The "General Task" Requirement:** As we discussed, you have tasks like "Renew Passport" that don't belong to a course. If tasks lived inside Course documents, you'd have nowhere to put these orphans.

---

### 3. The Code Implementation

Since we already built `User` and `Task` in the previous steps, here are the **Course** and **Material** models you need to complete the set.

#### **A. The Course Model**

Ridita will need this for the "Courses" page. It stores the metadata and the color code for your UI.

Create: `server/models/Course.js`

```javascript
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseTitle: {
        type: String,
        required: [true, 'Please add a course title'] // e.g., "Web Programming"
    },
    courseCode: {
        type: String,
        required: [true, 'Please add a course code'] // e.g., "CSE 4540"
    },
    color: {
        type: String,
        default: '#3b82f6' // Default blue if user doesn't pick one
    },
    semester: {
        type: String,
        default: 'Current'
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

```

#### **B. The Material Model**

This is for the "Instructive PDFs" mentioned in your proposal.pdf].

Create: `server/models/Material.js`

```javascript
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String, // This will store the path/URL to the uploaded file
        required: true
    },
    fileType: {
        type: String,
        default: 'pdf'
    }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);

```

### 4. How to "Join" Them (The NoSQL Trick)

When you need to display tasks on the dashboard and show their **Course Color**, you don't need a complex SQL JOIN query. Mongoose handles this with `.populate()`.

**Example Query (You already have this in your `taskController`):**

```javascript
const tasks = await Task.find({ user: req.user.id })
    .populate('course', 'courseCode color'); 
    // ^ This magically replaces the "course" ID with the actual course object 
    // containing only the courseCode and color fields.

```

**Summary:** Stick to your plan. Separate collections (Tables) are the professional standard for MERN apps of this complexity. You are on the right track.


me: 
you did not give me the tasks table


gemini:
Apologies for that oversight. You are absolutely right; you need the **Task Model** (which acts as the "table" definition in Mongoose) to make this work.

Here is the complete code for `server/models/Task.js`.

### **The Task Model (`server/models/Task.js`)**

This schema implements the architecture we discussed:

1. **User Link:** Required (so you know *who* has the pain).
2. **Course Link:** **Optional** (so you can have "General Academic" tasks).
3. **Pain Score Factors:** Includes `difficulty` and `weight` which are required for your algorithm.

```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // Link to the User (The "Foreign Key" to the Users Table)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Link to the Course (Optional "Foreign Key")
    // If empty, it's a "General Academic" task (e.g. Registration)
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },

    title: {
        type: String,
        required: [true, 'Please add a task title']
    },

    description: {
        type: String,
        default: ''
    },

    // --- PAIN SCORE METRICS ---
    deadline: {
        type: Date,
        required: [true, 'A deadline is required for Pain Score calculation']
    },
    
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 5
    },
    
    weight: {
        type: Number,
        required: true,
        min: 1,   // 1% importance
        max: 100, // 100% importance
        default: 10
    },

    // --- STATUS TRACKING ---
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
    },
    
    completedAt: {
        type: Date
    }

}, {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model('Task', taskSchema);

```

### **How this works in MongoDB (vs SQL)**

* **No "Create Table" Command:** unlike SQL, you don't need to run a command to create this table. As soon as you save the first Task using this model, MongoDB will automatically create a `tasks` collection (table) for you.
* **The References:** The `ref: 'User'` and `ref: 'Course'` lines tell Mongoose that these fields store the **IDs** of documents in those other collections, allowing you to "join" them later using `.populate()`.


me:
we need to have sub categories for tasks like lab task, exams, assignments, presentation etc


gemini:
This is a great addition. Categorizing tasks helps the user (and the system) differentiate between a "Final Exam" (high stress) and a "Lab Report" (medium stress).

Here is how to integrate **Task Categories** into your MERN stack.

### **1. Update the Backend (The Model)**

We will add a `category` field to your **Task Schema**. I've added the categories you requested, plus `Project` and `General` to cover all bases.

**File:** `server/models/Task.js`

```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },

    // --- NEW FIELD: CATEGORY ---
    category: {
        type: String,
        enum: ['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'],
        default: 'General',
        required: true
    },

    // Pain Score Metrics
    deadline: { type: Date, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 10, default: 5 },
    weight: { type: Number, required: true, min: 1, max: 100, default: 10 },
    
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
    },
    completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

```

---

### **2. Update the Frontend (The Modal)**

Now we need to let the user select this category when creating a task. We will add a **Dropdown** to your `AddTaskModal`.

**File:** `client/src/components/AddTaskModal.jsx`

Update the `formData` state and the form UI.

```jsx
// ... inside AddTaskModal component

const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    // Add category to initial state
    category: 'Assignment', 
    difficulty: 5,
    weight: 10,
    course: ''
});

// ... inside the return (JSX)

<form onSubmit={handleSubmit} className="task-form">
    {/* Title Input (Keep as is) */}
    <input 
        type="text" 
        name="title"
        placeholder="What do you need to do?" 
        className="modal-input-title"
        value={formData.title}
        onChange={handleChange}
        required
        autoFocus
    />

    <div className="form-row">
        {/* NEW: Category Dropdown */}
        <div className="input-group">
            <label>Type</label>
            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="modal-select"
            >
                <option value="Exam">Exam</option>
                <option value="Assignment">Assignment</option>
                <option value="Lab Task">Lab Task</option>
                <option value="Presentation">Presentation</option>
                <option value="Project">Project</option>
                <option value="General">General</option>
            </select>
        </div>

        {/* Deadline Input (Keep as is) */}
        <div className="input-group">
            <label><Calendar size={14}/> Deadline</label>
            <input 
                type="datetime-local" 
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
            />
        </div>
    </div>
    
    {/* Course Input (Keep as is) */}
    {/* ... rest of the form ... */}
</form>

```

### **3. Style the Dropdown**

Add this to your `AddTaskModal.css` to make the dropdown match your "Notion-style" aesthetic (clean and minimal).

**File:** `client/src/components/AddTaskModal.css`

```css
.modal-select {
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.9rem;
    cursor: pointer;
    outline: none;
    /* Remove default arrow to style consistently if desired, 
       but standard select is safer for quick dev */
}

.modal-select:focus {
    border-color: var(--accent-blue);
}

```

### **Why this helps your "Pain Score"**

You can now tweak your algorithm later to react to these categories. For example:

* If `category === 'Exam'`, you could automatically boost the **Weight** multiplier by 1.5x in the backend, because exams are inherently more stressful than "Lab Tasks".