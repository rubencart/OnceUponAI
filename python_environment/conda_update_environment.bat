@ECHO OFF
ECHO update environment
conda env update --name onceuponanai --file environment.yml python=3.10 --prune
pause