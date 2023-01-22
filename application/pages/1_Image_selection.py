import streamlit as st
from PIL import Image
from statemachine import StateMachine, State
import glob
import os
import random
import sched,time

# State machine
class UserExperience(StateMachine):
    "The user experience state machine"
    picture = State("picture", initial=True)
    prompt = State("prompt")
    digestion = State("digestion")

    # transitions
    to_prompt = picture.to(prompt) | digestion.to(prompt)
    to_digestion = prompt.to(digestion)
    to_picture = digestion.to(picture) 

    def on_exit_picture(self,image):
        print("Exit picture")
        st.session_state["image_to_digest"] = image
        
        

# Image handling
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
if "steps" not in st.session_state.keys():
    print("New statemachine is made")
    st.session_state["steps"] = UserExperience()
    print(st.session_state)
steps = st.session_state["steps"]

st.title("""Explore the collection""")
st.write("Scroll through the pictures")


match steps.current_state_value: 
    case "picture":
        print("Picture image ran")
        images = find_images(".\\data")
        image_path = get_random_image(images)

        st.button(label="New picture")

        def go_to_prompt():
            steps.to_prompt(image_path)
        st.button(label="Go to prompt",on_click=go_to_prompt)
        st.image(image_path,width=400)

    
    case "prompt":
        print("Prompt image ran")
        prompt_input = st.text_input("Fill in your prompt",value=st.session_state["image_to_digest"])
        if st.button(label="Digest!"):
            steps.to_digestion()
    
    case "digestion":
        image = Image.open("data/fish_digested.png")
        st.image(image,width=500)
        if st.button(label="Back to start"):
            steps.to_picture()

        
        if st.button(label="Back to prompt"):
            steps.to_prompt()










