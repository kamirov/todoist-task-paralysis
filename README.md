# todoist-task-paralysis

Selects a random Todoist task to do, filtered by some options

## Features

- Uses the Todoist JS API.
- Outputs the result in JSON format suitable for integration with other systems.

## Getting Started

### Prerequisites

- **Node.js** installed locally.
- **AWS CLI** configured with access to your AWS account.
- **Yarn** or **npm** for managing dependencies.
- **Todoist API Token**: You need a Todoist API token to access your completed tasks.

### Setup Instructions

1. **Clone the repository** or copy the code provided.
2. **Install dependencies**:
   ```bash
   yarn add axios dotenv luxon
   ```
3. **Set up environment variables**:
   - Create a `.env` file in the root directory and add the following variables:
     ```
     TODOIST_API_TOKEN=your_todoist_api_token_here
     BUILD_FILENAME=deployment-package
     AWS_LAMBDA_FUNCTION_NAME=todoist-task-paralysis
     ```
   - Alternatively, you can use the provided `.env.example` file as a starting point.
4. **Run the function locally**:
   - Use the provided script to invoke the Lambda handler locally:
     ```bash
     yarn local
     ```
5. **Manually create Lambda**:
   - Log into the AWS console and manually follow the process to create a new Lambda with a Node runtime (this is a nasty step, I ought to automate this)
6. **Deploy to AWS Lambda**:
   - **Build the deployment package**:
     ```bash
     yarn build
     ```
   - **Deploy the package**:
     ```bash
     yarn deploy
     ```
   - **Full Build and Deploy**:
     ```bash
     yarn deploy:full
     ```

### Package Scripts

Here are the available scripts in `package.json` for convenience:

- **`yarn local`**: Runs the function locally using `local.mjs`.
- **`yarn build`**: Builds a `.zip` package using the filename defined in `.env` (`BUILD_FILENAME`).
- **`yarn deploy`**: Deploys the built package to AWS Lambda using the function name specified in `.env` (`AWS_LAMBDA_FUNCTION_NAME`).
- **`yarn deploy:full`**: Runs the build script and then deploys the resulting package.
