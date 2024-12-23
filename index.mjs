import { TodoistApi } from "@doist/todoist-api-typescript";
import dotenv from "dotenv";

dotenv.config();

const TODOIST_API_TOKEN = process.env.TODOIST_API_TOKEN;
const BASE_URL = "https://api.todoist.com/sync/v9";

const labelMap = {
  work: "🪖 Work",
  chill: "😌 Chill",
};

const api = new TodoistApi(TODOIST_API_TOKEN);

export const handler = async (event) => {
  // const labelKey = labelMap[event.queryStringParameters.labelKey];
  const labelKey = "work";

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

  const labeledTasks = await getUncompletedTasks(labelMap[labelKey]);

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
    content: randomTask.content,
    project: projectName,
    section: sectionName,
    url: randomTask.url,
  };

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(presentationTask),
    };
  } catch (error) {
    console.error("Error fetching scores:", error);
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

async function getUncompletedTasks(label) {
  return await api.getTasks({
    label,
  });
}
