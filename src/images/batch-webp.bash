#!/usr/bin/env bash
for file in *.{png,jpg}
do
cwebp -q 90 "$file" -o "./webp/${file}.webp"
done
