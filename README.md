http://maybehug.me

This is just the web site for @zkat's [maybe-hugs](https://github.com/zkat/maybe-hugs).

Want to add a language? Head over to https://github.com/zkat/maybe-hugs and add it there! Once its landed, we can regenerate the web site using the script below.

## Rebuilding the site

Feel free to open an issue to get someone's attention to rebuild. If you're feeling awesome today, build it yourself and send a PR! :)

- clone the repo, then
```bash
cd scripts
npm i
npm start
git commit -am "generated site"
git push origin gh-pages
```
Also note: there is no master branch, so just work directly on the gh-pages branch!

## Developing
```bash
cd scripts
npm run watch
```
Hit http://localhost:8000 to preview the site. 
Changing files in `scripts` will automatically rebuild the files, so just refresh the browser after save.


## Contributing to this Project
This is an [OPEN Open Source](http://openopensource.org/) project
