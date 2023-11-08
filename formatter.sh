#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail
#set -x xtrace

if which find > /dev/null ; then
  find . -name "*.jsonld" -exec sh -c "jq . {} > {}.tmp && mv {}.tmp {} && echo {}" \;
else
  echo "error: the find command is required to run this script"
fi
