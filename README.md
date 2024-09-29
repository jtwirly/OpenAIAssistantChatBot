# OpenAI Assistant ChatBot

## Project Overview
This project is an interactive chatbot application that utilizes the OpenAI API to provide users with answers to questions about specific products. The application is built using an Express web server that serves a web page, allowing users to interact with the chatbot and view the responses.

<img width="1433" alt="Screen Shot 2024-09-29 at 12 18 14 AM" src="https://github.com/user-attachments/assets/0fc79f4d-a741-4780-9713-ba943fa587a8">

## Key Features
- **Product-Specific Chatbot**: The application includes an OpenAI Assistant that is capable of answering questions about products detailed in separate files. The assistant can provide information on a variety of products, including those from a bank and a grocery store.
- **Web-Based User Interface**: The application is powered by an Express web server that serves a web page, enabling users to interact with the chatbot. The web page features a clean, Bootstrap-styled dark mode interface.
- **Threaded Conversation**: The application manages the conversation between the user and the assistant using a threaded approach. Each user query is added to a new thread, which is then processed by the assistant. The responses are retrieved and displayed on the web page.
- **State Management**: The application maintains the state of the web page using a dictionary, which is used to pass data back and forth between the client and the server using the Fetch API.
- **OpenAI API Integration**: The application leverages the OpenAI API v2 to interact with the assistant, including retrieving the assistant's information, creating new threads, and running the assistant to generate responses.

## Getting Started

1. **Clone the Repository**: Start by cloning the project repository from GitHub.
2. **Set up OpenAI**: Obtain an OpenAI API key and set it up in your project's environment.
3. **Install Dependencies**: Install the required dependencies, including Express and any other necessary libraries.
4. **Run the Server**: Start the Express web server, which will serve the chatbot web page.
5. **Interact with the Chatbot**: Navigate to the web page in your browser and start asking questions about the available products. The chatbot will respond with relevant information.

## Project Structure
```bash
├── public/
│ ├── index.html
│ └── script.js
├── routes/
│ └── api.js
├── utils/
│ └── openai.js
├── app.js
├── package.json
└── README.md
```

- **public/**: Contains the HTML and JavaScript files for the web page.  
- **routes/**: Holds the API routes for the Express server.  
- **utils/**: Includes utility functions, such as the OpenAI API integration.  
- **app.js**: The main entry point of the Express application.  
- **package.json**: Lists the project dependencies.  
- **README.md**: The project documentation.  

## Contributing
If you find any issues or have suggestions for improvements, feel free to create a new issue or submit a pull request. Contributions are welcome!

## License
This project is licensed under the MIT License.
