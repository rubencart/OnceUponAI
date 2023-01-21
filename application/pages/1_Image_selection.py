import streamlit as st
from PIL import Image
from statemachine import StateMachine, State


class UserExperience(StateMachine):
    "The user experience state machine"
    choose_picture = State("picture", initial=True)
    choose_prompt = State("prompt")

    picture_selected = choose_picture.to(choose_prompt)
    prompt_selected = choose_prompt.to(choose_picture)

    def on_enter_choose_picture(self):
        print("Entered choose picture")

    def on_enter_choose_prompt(self):
        print("Entered choose prompt")


steps = UserExperience()


st.markdown("""# Down the rabbit hole 
                Choose a picture from the Collection Of Ghent""")


st.button(label="Go to prompt",on_click=steps.picture_selected())

st.button(label="Go to picture",on_click=steps.prompt_selected())

st.markdown(steps.current_state_value)









