#!/usr/bin/env bash
source variables.sh
git subtree add --prefix ${DIRECTORY_NAME} ${REPOSITORY_URL} ${BRANCH_NAME} --squash
