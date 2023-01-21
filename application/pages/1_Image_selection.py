import streamlit as st
from PIL import Image
from statemachine import StateMachine, State


class UserExperience(StateMachine):
    "The user experience state machine"
    picture = State("picture", initial=True)
    prompt = State("prompt")
    digestion = State("digestion")


    to_prompt = picture.to(prompt) | digestion.to(prompt)
    to_digestion = prompt.to(digestion)
    to_picture = digestion.to(picture)



# Keep state within session
if "steps" not in st.session_state:
    st.session_state["steps"] = UserExperience()
steps = st.session_state["steps"]

st.markdown("""# Welcome!""")

match steps.current_state_value:
    case "picture":
        st.markdown("Choose a picture")
        image = Image.open("pages/fish.jpg")
        st.image(image)

        if st.button(label="Go to prompt"):
            steps.to_prompt()
            st.experimental_rerun()
    
    case "prompt":
        prompt_input = st.text_input("Fill in your prompt",value="a fish on a white background in pointilism")
        if st.button(label="Digest!"):
            steps.to_digestion()
            st.experimental_rerun()
    
    case "digestion":
        image = Image.open("pages/fish_digested.png")
        st.image(image)
        if st.button(label="Back to start"):
            steps.to_picture()
            st.experimental_rerun()
        
        if st.button(label="Back to prompt"):
            steps.to_prompt()
            st.experimental_rerun()









