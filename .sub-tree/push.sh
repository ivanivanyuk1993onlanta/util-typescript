#!/usr/bin/env bash

source "$(dirname "$0")/variable-file.sh"

git subtree push --prefix "${SUBTREE_PREFIX}" "${REPOSITORY_NAME}" "${BRANCH_NAME}"
