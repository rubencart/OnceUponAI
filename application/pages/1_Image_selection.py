import streamlit as st
from PIL import Image
from statemachine import StateMachine, State
import glob

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
    images = {}
    for filename in glob.glob(f'{path}/*.jpg'):
        im = Image.open(filename)
        images[filename] = im
    for filename in glob.glob(f'{path}/*.png'):
        im = Image.open(filename)
        images[filename] = im
    return images

def subsets_of_images(images):
    # Group images per original and adaptations
    # structure: original_name: {original_file_name: image}, {adaptations: [image]}
    


# Keep state within session
if "steps" not in st.session_state:
    st.session_state["steps"] = UserExperience()
steps = st.session_state["steps"]

st.markdown("""# Welcome!""")

match steps.current_state_value:
    case "picture":
        images = find_images("data")
        subsets = subsets_of_images(images)
        print(subsets)


        if st.button(label="Go to prompt"):
            steps.to_prompt()
            st.experimental_rerun()
    
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








