import google.generativeai as genai
import streamlit as st
import time
import random
from utils import SAFETY_SETTTINGS


st.set_page_config(
    page_title="",
    page_icon="",
    menu_items={
      
    }
)

st.title("")
st.caption("a chatbot, powered by google gemini pro.")

st.session_state.app_key=""

if "history" not in st.session_state:
    st.session_state.history = []

genai.configure(api_key = st.session_state.app_key)

# Initialize the model and start a chat session with any existing history.
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history = st.session_state.history)

# Sidebar button to clear chat. This helps in managing the chat session effectively.
with st.sidebar:
    if st.button("Clear Chat Window", use_container_width = True, type="primary"):
        st.session_state.history = []
        st.rerun()

# Display the chat history.
for message in chat.history:
    role = "assistant" if message.role == "model" else message.role
    with st.chat_message(role):
        st.markdown(message.parts[0].text)

# Main chat input from the user.
if "app_key" in st.session_state:
    if prompt := st.chat_input(""):
        prompt = prompt.replace('\n', '  \n')
        with st.chat_message("user"):
            st.markdown(prompt)
        # Send and display the assistant's response.
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            message_placeholder.markdown("Thinking...")
            try:
                full_response = ""
                for chunk in chat.send_message(prompt, stream=True, safety_settings = SAFETY_SETTTINGS):
                    word_count = 0
                    random_int = random.randint(5, 10)
                    for word in chunk.text:
                        full_response += word
                        word_count += 1
                        if word_count == random_int:
                            time.sleep(0.05)
                            message_placeholder.markdown(full_response + "_")
                            word_count = 0
                            random_int = random.randint(5, 10)
                message_placeholder.markdown(full_response)
            except genai.types.generation_types.BlockedPromptException as e:
                st.exception(e)
            except Exception as e:
                st.exception(e)
            st.session_state.history = chat.history
