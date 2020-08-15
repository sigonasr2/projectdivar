find . -iname '*.jpg' -exec convert \{} -verbose -resize 48x48\> \{} \;
mv *.jpg ../small/