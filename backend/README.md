# OnceUponAI backend

## Set up

Get and install miniconda3 from https://docs.conda.io/en/latest/miniconda.html.
In terminal/command prompt:
```
# better to use conda than pip because geopandas has C dependencies
conda create -n gentenv python=3.10
conda activate gentenv
# install both geopandas and googlemaps with conda from the conda-forge channel, otherwise
#  mismatch causes issues: https://stackoverflow.com/questions/72231927/fiona-importerror-library-not-loaded-rpath-libpoppler-91-dylib
conda install geopandas pandas googlemaps ipython -c conda-forge
pip install openai tqdm httpx "fastapi[all]" pymongo
```

Install and run MongoDB community server, e.g. on Mac (M1):

```
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

Import the DB (download and unzip the [zip from discord](https://discord.com/channels/885643708173778954/994676748111327332/1099350376416821299)).
```
mongorestore <PATH_TO_UNZIPPED_DIR>/onceuponai/obj_location_links.bson --db onceuponai --collection obj_location_links
```

## Run

From the `backend/` folder: `uvicorn main:app --reload`. You should see something like this:
```
INFO:     Will watch for changes in these directories: ['/Users/rubenc/Documents/rapps/OUAI-pt2/LDES-API/backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [2423] using WatchFiles
INFO:     Started server process [2425]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```
And the process should keep running and printing logs of server activity.

Also make sure that Mongo DB is running in the background: `brew services start mongodb-community@6.0`.

Then browse to `http://127.0.0.1:8000` and you should see `{"message":"Hello World"}`.
Or send a post request to `http://127.0.0.1:8000/api/walk` with as data: `{'nb_locations': 2, 'messages': []}`.
```python
import requests
requests.post('http://127.0.0.1:8000/api/walk', json={'nb_locations': 2, 'messages': []}).json()
```
You should get a result like this:
```python
[{'object_id': '550016631',
  'title': 'Penning met de bustes van Van der Meersch en Van der Noot, (1790 ?)',
  'coordinates': [51.06783069999999, 3.7290914],
  'description': 'Op een koperen medaillon zijn in zilver de naar elkaar toe gewende bustes van Van der Meersch (links) en Van der Noot (rechts) opgezet met rondom op de verhoogde rand ingegraveerd, G.RL VAN DER MEERSCH (links) EN (boven) M. E. H. VAN DER NOOT (rechts) 1790 ? (onderaan).\r\nOp de keerzijde zijn de vier vijzen te zien van de opgezette figuren. Bovenaan is een rechthoekige lus met twee lauriertakjes.\r\n\r\nHendrik Karel Nicolaas van der Noot (Brussel, 7 januari 1731 - Strombeek, 12 januari 1827) was een Brabantse rechtsgeleerde, advocaat en politicus. Hij was één van de hoofdrolspelers van de Brabantse Omwenteling (1789-1790) tegen het Oostenrijkse gezag (keizer Jozef II). Deze omwenteling leidde tot de kortstondige oprichting van de Verenigde Nederlandse Staten (11 januari 1790 - december 1790).\r\nHet zijn Van der Noot en generaal Vander Meersch die in oktober 1789 met een patriottenleger vanuit Breda het keizerlijke deel van het hertogdom Brabant veroverden. In de eerste veroverde (of bevrijde) gemeente, Hoogstraten, publiceerde Van der Noot op 24 oktober 1789 zijn Manifest van het Brabantse Volk. Het document legt uit waarom het Brabantse volk het recht heeft om de gehoorzaamheid aan de keizer op te zeggen. Het belangrijkste argument is dat de wil van de natie de hoogste wet is, en als die geschonden wordt door een heerser, dan mag de natie tegen die heerser dus in opstand komen. Achtereenvolgens werden in twee maanden Turnhout, Gent en Brussel veroverd. Ook de andere Zuid-Nederlandse staten zeggen Jozef II wacht aan. De Staten van Vlaanderen doen dat op 4 januari 1790 met het Manifest van de Provincie Vlaanderen. Kort daarop werd Van der Noot het hoofd van de nieuwe confederale Zuid-Nederlandse republiek.\nDeze straat is vernoemd naar Hendrik Karel Nicolaas van der Noot, een van de hoofdrolspelers van de Brabantse Omwenteling (1789-1790). Hij was samen met generaal Vander Meersch verantwoordelijk voor de verovering van Hoogstraten, Gent en Brussel. De penning met de bustes van Van der Meersch en Van der Noot is een herinnering aan hun veroveringen en hun strijd voor het recht van het Brabantse volk.',
  'address': '9000 Ghent, Belgium',
  'image_url': None,
  'location_link': 'ChatGPT',
  'collection': 'stam'},
 {'object_id': '670028667',
  'title': 'Gent: Sleepstraat en hoek Spijkeboorstraat: estaminet Bakje Bieren, 1911',
  'coordinates': [51.060103, 3.72516],
  'description': 'Estaminet Bakje Bieren, gelegen op de hoek van de Sleepstraat (horizontaal) en Spijkeboorstraat (links).\r\n\r\nOp de voorkant een stempel van Bibliotheca Gandavensis.\nDit adres heeft een relatie met het object omdat het estaminet Bakje Bieren in 1911 op de hoek van de Sleepstraat en Spijkeboorstraat gelegen was. De stempel van Bibliotheca Gandavensis op de voorkant suggereert dat het object een historisch document is dat waarschijnlijk in de bibliotheek is gedocumenteerd.',
  'address': 'Sleepstraat 2, 9000 Gent, Belgium',
  'image_url': 'https://api.collectie.gent/iiif/image/iiif/2/b721400fd04c4a0dc2f81193800bda9c-transcode-MA_SCMS_FO_06291bis.jpg/full/400,/0/default.jpg',
  'location_link': 'ChatGPT',
  'collection': 'archiefgent'}]
```

## Draft
```
uvicorn main:app --reload
brew services start mongodb-community@6.0

```

Docs:
- https://fastapi.tiangolo.com/tutorial/body-nested-models/#bodies-of-pure-lists
- https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/
- https://www.prisma.io/dataguide/mongodb/setting-up-a-local-mongodb-database#setting-up-mongodb-on-macos
- https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
- https://www.mongodb.com/basics/create-database
- https://www.mongodb.com/docs/manual/tutorial/insert-documents/
- https://www.mongodb.com/languages/python
- 

