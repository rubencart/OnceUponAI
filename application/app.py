"""Streamlit app to generate images."""

# Import from standard library
import logging
import random
import re
import requests
import shutil

# Import from 3rd party libraries
import streamlit as st
import streamlit.components.v1 as components


# Configure logger
logging.basicConfig(format="\n%(asctime)s\n%(message)s", level=logging.INFO, force=True)


# Define function
def generate_image(prompt: str, image_path, style: str = ""):
    st.session_state.output = ""

    with text_spinner_placeholder:
        with st.spinner("Please wait while your image is being generated..."):
    
            logging.info(
                f"Input to StableDiffusion: '{prompt}' path: '{image_path}'\n"
            )

            data = {"promptText":prompt + "in a photorealistic high quality style","url":image_path,"similarity":0.5}
            image = requests.post("http://192.168.0.37:4444/create",json=data,stream=True)
            with open("./responses/0.png", 'wb') as f:
                image.raw.decode_content = True
                shutil.copyfileobj(image.raw, f)   
            st.session_state.output = image.raw
            st.session_state.input = image_path


def get_random_image():
    urls = {
        "glasses": "https://api.collectie.gent/iiif/imageiiif/3/5d25a1d12130f6a52e8f3d73377090b4-transcode-2003-002-124.jpg/full/%5E1000,/0/default.jpg",
        "street": "https://api.collectie.gent/iiif/imageiiif/3/4bc39868780407d6817020ec414a7ed1-transcode-MA_SCMS_FO_03235.jpg/full/%5E1000,/0/default.jpg",
        "portrait": "https://api.collectie.gent/iiif/imageiiif/3/90d6b06b30ef1bbf8886cb6138853d86-transcode-14510_04.jpg/full/%5E1000,/0/default.jpg",
        "typemachine": "https://api.collectie.gent/iiif/imageiiif/3/8582bdbc4e2de7f22127750741b16573-transcode-V31743.jpg/full/%5E1000,/0/default.jpg",
        "foto_1":"https://api.collectie.gent/iiif/imageiiif/3/a4d8390829b627b99dccd2fa0b28470e-transcode-A65_02_042_1-2.jpg/full/%5E1000,/0/default.jpg",
        "foto_2":"https://api.collectie.gent/iiif/imageiiif/3/c0b9b4898f333522ac4853673adbc0cb-transcode-MA_SCMS_FO_03466.jpg/full/%5E1000,/0/default.jpg",
        "foto_3":"https://api.collectie.gent/iiif/imageiiif/3/6d99c2a3581db8720422316483264248-transcode-CG_00255.jpg/full/%5E1000,/0/default.jpg",
        "foto_4":"https://api.collectie.gent/iiif/imageiiif/3/62a4d37bac497bb104ee273c6af57ab0-transcode-2021-029-149.jpg/full/%5E1000,/0/default.jpg",
        "foto_5":"https://api.collectie.gent/iiif/imageiiif/3/0163175e460637855cf64e719997d80a-transcode-MA_ROM_XVI_AF_08173_R.jpg/full/%5E1000,/0/default.jpg",
        "foto_6":"https://api.collectie.gent/iiif/imageiiif/3/1c568563e3e2a913c36b9f6aa6c7b55f-transcode-13703.jpg/full/%5E1000,/0/default.jpg",
        "foto_7":"https://api.collectie.gent/iiif/imageiiif/3/66474746100070341c607cb73a03670c-transcode-A2016_13$02.jpg/full/%5E1000,/0/default.jpg"
            }
    picture_name = random.choice(list(urls.keys()))
    picture_path = urls[picture_name]
    return picture_path

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
image_path =  get_random_image()
st.image(image_path,width=200)
topic = st.text_input(label="Prompt", placeholder="Make a robot")
if topic == "":
    topic = "Make a robot"



st.session_state.feeling_lucky = not st.button(
    label="Digest!",
    type="primary",
    on_click=generate_image,
    args=(topic, image_path),
)


text_spinner_placeholder = st.empty()
if st.session_state.text_error:
    st.error(st.session_state.text_error)

if st.session_state.output:
    st.markdown("""---""")
    st.title("Your digested collection item")
    col1, col2 = st.columns(2)

    with col1:
        st.write("Original")
        st.image(st.session_state.input,width=300) 
    with col2:
        st.write("Digested")
        st.image("./responses/0.png",width=300)
    
    image_spinner_placeholder = st.empty()
    st.audio("toilet.mp3")
    st.markdown("""---""")

