#!/usr/bin/env bash
source "$(realpath $(dirname "$0"))/variables.sh"

git subtree add --prefix ${DIRECTORY_NAME} ${REPOSITORY_URL} ${BRANCH_NAME} --squash
