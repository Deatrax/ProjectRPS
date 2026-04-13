const fs = require('fs');
const path = require('path');

const rootDir = 'e:\\1.DEVELOPMENT\\My Git repo projects\\ProjectRPS';
const projectMaterialsDir = path.join(rootDir, 'project_materials');
const outputFile = path.join(projectMaterialsDir, 'project_context.md');

if (!fs.existsSync(projectMaterialsDir)) {
    fs.mkdirSync(projectMaterialsDir, { recursive: true });
}

const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.vscode', 'assets', 'project_materials'];
const ignoreFiles = ['package-lock.json', 'README.md', '.env', 'env.txt', '.gitignore', 'context_generator.js', 'out.log'];
const ignoreExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.pdf', '.ico'];

const plannedAndAchieved = "# Project Context & Progress\n\n" +
"## What has been planned and achieved till now\n\n" +
"**Achieved:**\n" +
"- **Project Structure**: Set up a full-stack MERN-like architecture with Vite+React for the frontend and Node+Express backend.\n" +
"- **Authentication**: User Signup and Login workflows implemented.\n" +
"- **Courses Management**: Functionality to add, view, and manage courses (Courses, CourseDetail, AddCourse routines).\n" +
"- **Task Management**: Features covering Tasks and AllTasks modules allowing creation and tracking of tasks within courses.\n" +
"- **Materials**: Uploading/Managing course materials.\n" +
"- **Dashboard & Analytics**: Created a Dashboard with an Analytics view for progress tracking.\n" +
"- **Routing & API Setup**: Backend routes for `auth`, `course`, `courses`, `material`, and `tasks` integrated with matching frontend pages.\n\n" +
"**Planned / Next Steps:**\n" +
"- Further UI/UX enhancements and responsiveness improvements.\n" +
"- Advanced analytics and visualizations on the dashboard.\n" +
"- Refinement of task tracking with notifications and deadlines.\n" +
"- Adding comprehensive error handling and testing.\n\n" +
"---\n\n" +
"# Codebase: Frontend & Backend\n\n";

let markdownContent = plannedAndAchieved;

function scanDir(dir, label) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (!ignoreDirs.includes(entry.name)) {
                scanDir(path.join(dir, entry.name), label);
            }
        } else {
            if (ignoreFiles.includes(entry.name)) continue;
            
            const ext = path.extname(entry.name).toLowerCase();
            if (ignoreExts.includes(ext)) continue;

            const filePath = path.join(dir, entry.name);
            const relativePath = path.relative(rootDir, filePath);
            
            let fileContent = '';
            try {
                fileContent = fs.readFileSync(filePath, 'utf8');
                let lang = '';
                if (ext === '.js' || ext === '.jsx') lang = 'javascript';
                else if (ext === '.css') lang = 'css';
                else if (ext === '.json') lang = 'json';
                else if (ext === '.html') lang = 'html';

                markdownContent += "## " + relativePath + "\n\n" +
                                   "```" + lang + "\n" +
                                   fileContent +
                                   "\n```\n\n";
            } catch (error) {
                console.error('Error reading file:', filePath);
            }
        }
    }
}

console.log('Scanning client directory...');
scanDir(path.join(rootDir, 'client'), 'Frontend');

console.log('Scanning server directory...');
scanDir(path.join(rootDir, 'server'), 'Backend');

fs.writeFileSync(outputFile, markdownContent);
console.log('project_context.md generated successfully at: ' + outputFile);
