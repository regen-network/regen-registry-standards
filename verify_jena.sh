#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail
#set -x xtrace

rm -rf apache-jena*
wget -r -nd --no-parent -R 'index.html*' --accept-regex 'apache-jena-([0-9\.]*).tar.gz' https://dlcdn.apache.org/jena/binaries/ -o /dev/null
JENA=$(find . -name "apache-jena-*.tar.gz")
VERSION=$(echo $JENA | perl -wne '/apache-jena-([0-9\.]*).tar.gz/i and print $1')
SUM=$(sha512sum apache-jena-$VERSION.tar.gz)
XSUM=$(cat apache-jena-$VERSION.tar.gz.sha512)
test "$SUM"="$XSUM" && echo "jena has a valid checksum" || echo "jena does not have a valid checksum"
mkdir -p apache-jena
tar -xzf apache-jena-$VERSION.tar.gz -C apache-jena --strip-components=1
