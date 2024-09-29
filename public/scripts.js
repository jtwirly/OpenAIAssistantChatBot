let state = {
  assistant_id: null,
  assistant_name: null,
  thread_id: null,
  run_id: null,
  messages: [],
};

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('getAssistant').addEventListener('click', getAssistant);
  document.getElementById('createThread').addEventListener('click', createThread);
  document.getElementById('inputPrompt').addEventListener('click', inputPrompt);
  document.getElementById('runAgent').addEventListener('click', run_agent);

  // Add event listeners for manual ID input
  document.getElementById('assistantId').addEventListener('change', updateAssistantId);
  document.getElementById('threadId').addEventListener('change', updateThreadId);
  document.getElementById('runId').addEventListener('change', updateRunId);
});

function updateAssistantId(event) {
  state.assistant_id = event.target.value;
}

async function getAssistant() {
  const nameInput = document.getElementById('assistantName').value;
  const idInput = document.getElementById('assistantId').value;
  try {
      const response = await fetch('/api/assistants', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: nameInput, id: idInput }),
      });
      const data = await response.json();
      if (data.error) {
          throw new Error(data.error);
      }
      state.assistant_id = data.assistant_id;
      state.assistant_name = data.assistant_name;
      document.getElementById('assistantId').value = state.assistant_id;
      document.getElementById('assistantName').value = state.assistant_name;
      updateContextWindow(`Assistant "${state.assistant_name}" (ID: ${state.assistant_id}) retrieved.`);
  } catch (error) {
      console.error('Error getting assistant:', error);
      updateContextWindow(`Error getting assistant: ${error.message}`, 'error-message');
  }
}

async function createThread() {
  try {
      const response = await fetch('/api/threads', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assistantId: state.assistant_id }),
      });
      const data = await response.json();
      state.thread_id = data.thread_id;
      document.getElementById('threadId').value = state.thread_id;
      updateContextWindow('New context thread created.');
  } catch (error) {
      console.error('Error creating thread:', error);
      updateContextWindow('Error creating thread. Please try again.');
  }
}

function inputPrompt() {
  const userPromptInput = document.getElementById('userPrompt');
  const prompt = userPromptInput.value.trim();
  
  if (prompt) {
      updateContextWindow(`User input received: "${prompt}"`, 'system-message');
      userPromptInput.focus();
  } else {
      updateContextWindow("Please enter a prompt before clicking 'Input User Prompt'.", 'error-message');
  }
}

async function run_agent() {
  try {
      const userPromptInput = document.getElementById('userPrompt');
      const userPrompt = userPromptInput.value.trim();
      console.log("User prompt:", userPrompt); // Add this line for debugging

      if (!userPrompt) {
          updateContextWindow("Please enter a prompt before running the agent.", 'error-message');
          return;
      }

      if (!state.thread_id) {
          updateContextWindow("Please create a new context thread before running the agent.", 'error-message');
          return;
      }

      if (!state.assistant_id) {
          updateContextWindow("Please retrieve an assistant before running the agent.", 'error-message');
          return;
      }

      updateContextWindow(`user: ${userPrompt}`, 'user-message');

      const response = await fetch('/api/run', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              message: userPrompt,
              thread_id: state.thread_id,
              assistant_id: state.assistant_id
          }),
      });

      const data = await response.json();
      console.log("API response:", data); // Add this line for debugging

      if (data.error) {
          throw new Error(data.error);
      }

      state.run_id = data.run_id;
      document.getElementById('runId').value = state.run_id;

      if (data.message && data.message.role === 'assistant') {
          updateContextWindow(`assistant: ${data.message.content}`, 'assistant-message');
      } else {
          throw new Error('Unexpected response format from server');
      }

      userPromptInput.value = ''; // Clear the input field after successful run
  } catch (error) {
      console.error('Error running agent:', error);
      updateContextWindow(`Error: ${error.message}`, 'error-message');
  }
}

function displayLastMessage() {
  if (state.messages.length > 0) {
      const lastMessage = state.messages[state.messages.length - 1];
      updateContextWindow(`${lastMessage.role}: ${lastMessage.content}`);
  }
}

function updateContextWindow(message, className) {
  const contextWindow = document.getElementById('agentContextWindow');
  const messageElement = document.createElement('p');
  messageElement.className = className;
  messageElement.textContent = message;
  contextWindow.appendChild(messageElement);
  contextWindow.scrollTop = contextWindow.scrollHeight;
}

function updateAssistantId(event) {
  state.assistant_id = event.target.value;
}

function updateThreadId(event) {
  state.thread_id = event.target.value;
}

function updateRunId(event) {
  state.run_id = event.target.value;
}