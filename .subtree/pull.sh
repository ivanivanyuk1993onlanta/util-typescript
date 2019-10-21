#!/usr/bin/env bash
echo $(realpath $(dirname "$0"))
source "$(realpath $(dirname "$0"))/variables.sh"
git subtree pull --prefix ${DIRECTORY_NAME} ${REPOSITORY_URL} ${BRANCH_NAME} --squash
