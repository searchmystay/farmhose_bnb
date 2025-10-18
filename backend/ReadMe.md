# Backend Template for Flask Applications

This template is designed to help our company quickly set up Flask projects with a consistent structure and necessary components.

## File Structure

- **database/**: Contains everything related to the database, such as schemas and common operations. Example file names include `auth_operation.py`, `chat_operations.py`, and `payment_operations.py`.
- **logics/**: The main directory for writing business logic. It interacts with the database and routes to process and return data. Example file names include `auth_logics.py`, `chat_logics.py`, and `payment_logics.py`.
- **routes/**: Defines blueprints and routes for different functionalities, such as authentication, chat, and payment. Example file names include `auth_routes.py`, `chat_routes.py`, and `payment_routes.py`. Routes should only handle data transfer, call logic functions, jsonify the data, and return it, without doing any extra processing.
- **utils/**: Contains common utilities that can be used throughout the project, such as exception handlers and loggers. The `exception_handler.py` file is included in the template.
**config.py**: This file is used to store important configuration settings for the project. It includes values like prices for different packages or paths to important resources. By keeping these values in one place, it makes it easy to update them without changing the code everywhere. For example, if you have a subscription service, you might define the price of each tier in `config.py` like this:
```python
BASIC_PLAN_PRICE = 9.99
PREMIUM_PLAN_PRICE = 19.99
```
This way, if the prices change, you only need to update them in one place.

## Getting Started

To set up the backend, follow these simple steps:

1. Navigate to the `backend` folder.
2. Create a virtual environment with `python -m venv venv`.
3. Activate the virtual environment using the appropriate command for your operating system:
   - On Windows: `venv\Scripts\activate`
   - On macOS and Linux: `source venv/bin/activate`
4. Run `pip install -r requirements.txt` to install all necessary dependencies.
5. Start the server with `flask run --host 0.0.0.0 --debug`.

This template is here to make your development process smoother and more efficient. Enjoy coding!

