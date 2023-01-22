import streamlit as st
from PIL import Image
from statemachine import StateMachine, State
import glob
import os
import random
import pickle

# State machine
class UserExperience(StateMachine):
    "The user experience state machine"
    picture = State("picture", initial=True)
    prompt = State("prompt")
    digestion = State("digestion")

    # transitions
    to_prompt = picture.to(prompt) | digestion.to(prompt)
    to_digestion = prompt.to(digestion)
    to_picture = digestion.to(picture) | picture.to(picture)

    def on_exit_picture(self,image):
        st.session_state["image_to_digest"] = image

class LogObserver(object):
    def __init__(self, name):
        self.name = name

    def after_transition(self, event, source, target):
        print("{} after: {}--({})-->{}".format(self.name, source.id, event, target.id))

    def on_enter_state(self, target, event):
        print("{} enter: {} from {}".format(self.name, target.id, event))       
        

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


st.title("""Explore the collection""")

if os.path.exists("save.p"):
    image_path = pickle.load(open( "save.p", "rb" ))
    st.write(image_path)

    if st.button("Again!"):
        os.remove("save.p")
else:
    st.button("Refresh!")
    with st.form("Collectie van Gent"):
        images = find_images(".\\data")
        image_path = get_random_image(images)
        st.image(image_path,width=400)


        genre = st.radio("Add a",('toilet', 'flamingo', 'astronaut'))

        # Every form must have a submit button.
        submitted = st.form_submit_button("Submit")
        if submitted:
            pickle.dump(image_path, open( "save.p", "wb" ))














