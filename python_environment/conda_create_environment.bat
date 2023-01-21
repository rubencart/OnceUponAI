@ECHO OFF
ECHO Creating environment
conda env create --prefix ./env --file environment.yml python=3.10 --force
pause