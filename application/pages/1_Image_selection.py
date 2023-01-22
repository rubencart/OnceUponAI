import streamlit as st
from PIL import Image
from statemachine import StateMachine, State
import glob
import os
#import schedule
import time
import random

class UserExperience(StateMachine):
    "The user experience state machine"
    picture = State("picture", initial=True)
    prompt = State("prompt")
    digestion = State("digestion")

    # transitions
    to_prompt = picture.to(prompt) | digestion.to(prompt)
    to_digestion = prompt.to(digestion)
    to_picture = digestion.to(picture)

def find_images(path):
    folders = [name for name in os.listdir(path) if os.path.isdir(os.path.join(path, name))]
    subset = {}
    for folder in folders:
        image_paths = glob.glob(path + "\\" + folder + "/*")
        subset[folder] = image_paths
    return subset

def get_random_image(subset):
    picture_name = random.choice(list(subset.keys()))
    picture_path = subset[picture_name][0]
    return picture_path

# Keep state within session
if "steps" not in st.session_state:
    st.session_state["steps"] = UserExperience()
steps = st.session_state["steps"]

st.markdown("""# Welcome!""")

match steps.current_state_value:
    case "picture":
        images = find_images(".\\data")
        image_path = get_random_image(images)

        
        # schedule.every(3).seconds.do(get_random_picture(images))

        if st.button(label="Go to prompt"):
            steps.to_prompt()
            st.session_state["image_to_digest"] = image_path
            st.experimental_rerun()
        st.image(image_path,width=200)
    
    case "prompt":
        prompt_input = st.text_input("Fill in your prompt",value="a fish on a white background in pointilism")
        if st.button(label="Digest!"):
            steps.to_digestion()
            st.experimental_rerun()
    
    case "digestion":
        image = Image.open("data/fish_digested.png")
        st.image(image,width=500)
        if st.button(label="Back to start"):
            steps.to_picture()
            st.experimental_rerun()
        
        if st.button(label="Back to prompt"):
            steps.to_prompt()
            st.experimental_rerun()








