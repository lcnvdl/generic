@echo off
cd jscompiler

@echo Engine...
del "..\..\lib\engine.min.js"
java -jar compiler.jar --js="..\..\lib\engine.js" --js_output_file="..\..\lib\engine.min.js"

@echo Done!

pause