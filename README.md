http://maybehug.me

This is just the web site for: https://github.com/zkat/maybe-hugs

## Rebuilding the site
- clone the repo, then
```bash
cd scripts
npm i
npm start
git commit -am "generated site"
git push origin gh-pages
```


## Developing
```bash
cd scripts
npm run watch
```
Hit http://localhost:8000 to preview the site. 
Changing files in `scripts` will automatically rebuild the files, so just refresh the browser after save.