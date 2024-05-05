from PIL import Image
import google.generativeai as genai
import streamlit as st
import time
import random
from utils import SAFETY_SETTTINGS
from GEMINI_API_KEY import Gemini_API_KEY
from io import BytesIO

st.set_page_config(
    page_title="Cross Border Chatbot",
    page_icon="",
    menu_items={
        'About': ""
    }
)

st.title('Upload Image And Ask')
st.session_state.app_key=Gemini_API_KEY
genai.configure(api_key = st.session_state.app_key)
model = genai.GenerativeModel('gemini-pro-vision')


"""
    Sends the user's prompt and the uploaded image to the Gemini Pro Vision model, displays a loading message,
    and shows the model's response in the chat.

    Parameters:
    - prompt (str): The user's query about the uploaded image.
    - image (PIL.Image): The uploaded image that the user queries about.
    - loading_str (str): A temporary loading message shown while waiting for the model's response.
"""

def show_message(prompt, image, loading_str):
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        message_placeholder.markdown(loading_str)
        full_response = ""
        try:
            byte_io = BytesIO()
            if image.mode == 'RGBA':
                image = image.convert('RGB')
            image.save(byte_io, format='JPEG')  
            byte_io.seek(0)
            image_bytes = byte_io.read() 

            for chunk in model.generate_content([prompt, image], stream = True, safety_settings = SAFETY_SETTTINGS):                   
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
        except genai.types.generation_types.BlockedPromptException as e:
            st.markdown("Error! Please try again!")
        except Exception as e:
            st.markdown("Error! Please try again!")
        message_placeholder.markdown(full_response)
        st.session_state.history_pic.append({"role": "assistant", "text": full_response})

    """
    Clears the chat history stored in the session state.
    This function is typically called when the user uploads a new image,
    resetting the conversation related to the previous image.
    """
def clear_state():
    st.session_state.history_pic = []


if "history_pic" not in st.session_state:
    st.session_state.history_pic = []


image = None
if "app_key" in st.session_state:
    uploaded_file = st.file_uploader("choose a pic...", type=["jpg", "png", "jpeg", "gif"], label_visibility='collapsed', on_change = clear_state)
    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        width, height = image.size
        resized_img = image.resize((128, int(height/(width/128))), Image.LANCZOS)
        st.image(image)    

if len(st.session_state.history_pic) > 0:
    for item in st.session_state.history_pic:
        with st.chat_message(item["role"]):
            st.markdown(item["text"])

if "app_key" in st.session_state:
    if prompt := st.chat_input("describe this picture"):
        if image is None:
            st.warning("Please upload an image first", icon="⚠️")
        else:
            prompt = prompt.replace('\n', '  \n')
            with st.chat_message("user"):
                st.markdown(prompt)
                st.session_state.history_pic.append({"role": "user", "text": prompt})
            
            show_message(prompt, resized_img, "Thinking...")
