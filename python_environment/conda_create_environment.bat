@ECHO OFF
ECHO Creating environment
conda env create --prefix ./env --file environment.yml --force
pause