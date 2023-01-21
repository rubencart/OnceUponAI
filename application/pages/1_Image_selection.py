import streamlit as st
from PIL import Image

st.markdown("""# Down the rabbit hole - 
                Choose a picture from the Collection Of Ghent""")


image = Image.open('pages/fish.jpg')
st.image(image, caption="A fish")

