import { TodoistApi } from "@doist/todoist-api-typescript";
import dotenv from "dotenv";
import { DateTime } from "luxon";

dotenv.config();

const TODOIST_API_TOKEN = process.env.TODOIST_API_TOKEN;
const BASE_URL = "https://api.todoist.com/sync/v9";

const labelMap = {
  work: "🪖 Work",
  chill: "😌 Chill",
};

const api = new TodoistApi(TODOIST_API_TOKEN);
const today = DateTime.now().setZone("America/Toronto").startOf("day");

export const handler = async (event) => {
  const labelKey = event.queryStringParameters.labelKey ?? null;

  if (!labelKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing label key" }),
    };
  }

  if (!Object.keys(labelMap).includes(labelKey)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Invalid label. Available label keys: ${Object.keys(
          labelMap
        ).join(", ")}`,
      }),
    };
  }

  const labeledTasks = await getTasks(labelMap[labelKey]);

  console.log(
    `Found ${labeledTasks.length} uncompleted tasks with label key ${labelKey}`
  );

  if (!labeledTasks.length) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `No tasks found with label key ${labelKey}`,
      }),
    };
  }

  const randomTask =
    labeledTasks[Math.floor(Math.random() * labeledTasks.length)];
  console.log("Random task:", randomTask);

  const projectName = await getProjectName(randomTask.projectId);
  const sectionName = await getSectionName(randomTask.sectionId);

  const presentationTask = {
    type: labelMap[labelKey],
    project: projectName,
    section: sectionName,
    content: randomTask.content,
    url: randomTask.url,
    taskCount: labeledTasks.length,
  };

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(presentationTask),
    };
  } catch (error) {
    console.error("Error fetching task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

function getProjectName(projectId) {
  return api
    .getProject(projectId)
    .then((project) => project.name)
    .catch(() => "(No project)");
}

function getSectionName(sectionId) {
  return api
    .getSection(sectionId)
    .then((section) => section.name)
    .catch(() => "(No section)");
}

async function getTasks(label) {
  const tasks = await api.getTasks({
    label,
  });

  const tasksNotScheduledInTheFuture = tasks.filter((task) => {
    return !task.due || DateTime.fromISO(task.due.date) <= today;
  });

  return tasksNotScheduledInTheFuture;
}
