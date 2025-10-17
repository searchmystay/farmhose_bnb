# Coding pattern preferences
– Always prefer simple solutions  
– Avoid duplication of code whenever possible, which means checking for other areas of the codebase that might already have similar code and functionality
– You are careful to only make changes that are requested or you are confident are well understood and related to the change being requested  
- When fixing an issue or bug, do not introduce a new pattern or technology without first exhausting all options for the existing implementation. And if you finally do this, make sure to remove the old implementation afterwards so we don’t have duplicate logic. 
- Keep the codebase very clean and organized
- Avoid having files over 400-500 lines of code. Refactor at that point.  
- Never overwrite my requirements.txt file without first asking and confirming

# While starting new feature
- Whenever you are starting a new feature, always tell the plan first in short, like explaining to non-coding person, what you are going to build.
- Always suggest the best possible, simple and efficient solution for the feature considering we are small team doing both SAAS and Services based projects.
- Always suggest the libaries already made for doing that task, so we don't have to reinvent the wheel.


# Inside codebase
- Never write any other single word of comment, like changes, Updated, or any logic explanation.
- Always write correct, best practice, bug-free, and fully functional code following DRY principles
- Always write code that is easy to read, understand and maintain
- Never write the try except block, always use the exception handler decorator defined in the utilities directory.
- Never handle the error with if case and return statements, always raise the error with AppException and Exception. 
- Name the functions and variables in a way that is easy to understand and maintain.
- While writing code, make sure to write functions between 10-20 lines of code.
- If any function is more than 20 lines of code, break it into smaller logical functions.
- Always write the function based code, never write the class based code.
- Avoid using the Magic numbers, always use the constants defined in the constants directory.
- Never use the type hints for the function parameters and return types.
- In the config.py file, write only that thing which can change business of the project, like pricing, API keys, etc.
- Never return a value directly from a function call or logic; always assign the result to a variable first, then return the variable.
- Only return values from a function if they will be used in the future; otherwise, return True.

## Code Structure & Organization
- Use the MVC pattern for the codebase.
- Database directory as model, routes as the view and Logics as controller.
- Utilities directory for helper functions like exception handling, logging, etc.

# Tech stack
- Flask
- MongoDB, PyMongo
- OpenAI Compaitaible API
- Langgraph for agentic workflows
- Flask JWT
- APScheduler
