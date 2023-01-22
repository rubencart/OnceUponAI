"""Streamlit app to generate images."""

# Import from standard library
import logging
import random
import re

# Import from 3rd party libraries
import streamlit as st
import streamlit.components.v1 as components


# Configure logger
logging.basicConfig(format="\n%(asctime)s\n%(message)s", level=logging.INFO, force=True)


# Define function
def generate_text(topic: str, mood: str = "", style: str = ""):
    st.session_state.output = ""


    with text_spinner_placeholder:
        with st.spinner("Please wait while your image is being generated..."):
            prompt = topic
            output = "this is an image!"

            logging.info(
                f"Topic: {topic}{prompt}{output}\n"
            )
            st.session_state.output = prompt


# Configure Streamlit page and state
st.set_page_config(page_title="Collection Of Ghent", page_icon="🤖")

if "output" not in st.session_state:
    st.session_state.output = ""

if "text_error" not in st.session_state:
    st.session_state.text_error = ""



# Force responsive layout for columns also on mobile
st.write(
    """<style>
    [data-testid="column"] {
        width: calc(50% - 1rem);
        flex: 1 1 calc(50% - 1rem);
        min-width: calc(50% - 1rem);
    }
    </style>""",
    unsafe_allow_html=True,
)

# Render Streamlit page
st.title("Digest the Collection of Ghent")
st.markdown(
    "This mini-app generates alterations of the collection of Ghent. Have Fun!"
)
topic = st.text_input(label="Prompt", placeholder="AI")



st.session_state.feeling_lucky = not st.button(
    label="Generate text",
    type="primary",
    on_click=generate_text,
    args=(topic, "mood"),
)


text_spinner_placeholder = st.empty()
if st.session_state.text_error:
    st.error(st.session_state.text_error)

if st.session_state.output:
    st.markdown("""---""")
    st.text_area(label="Prompt", value=st.session_state.output, height=100)



    image_spinner_placeholder = st.empty()


    st.markdown("""---""")
