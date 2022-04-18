ECHO ON
cd dist
git init
git remote add origin https://github.com/cspidar/movword
git add . -f
git commit -m '1'
git push -f origin main
cd..


