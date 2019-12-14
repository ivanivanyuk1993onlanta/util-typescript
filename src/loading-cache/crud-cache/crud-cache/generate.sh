#!/usr/bin/env bash
while [[ "${1:-}" != "" ]]; do
    case "$1" in
        "--additionalImportCode")
            shift
            ADDITIONAL_IMPORT_CODE=$1
            ;;
        "--keyType")
            shift
            KEY_TYPE=$1
            ;;
        "--targetDir")
            shift
            TARGET_DIR=$1
            ;;
        "--updateMetaDataType")
            shift
            UPDATE_META_DATA_TYPE=$1
            ;;
        "--valueType")
            shift
            VALUE_TYPE=$1
            ;;
    esac
    shift
done

TARGET_DIR=${TARGET_DIR}/generated/github.com/ivanivanyuk1993/util-go/crud-cache/${KEY_TYPE}-${UPDATE_META_DATA_TYPE}-${VALUE_TYPE}
TARGET_DIR=$(echo "${TARGET_DIR}" | sed 's/*/-star-/g')
mkdir -p ${TARGET_DIR}
for FILE_NAME in $(dirname $(realpath "$0"))/*.go; do
    sed -z "s#package crud_cache\n#package crud_cache\n\n${ADDITIONAL_IMPORT_CODE}\n#" ${FILE_NAME} |
    sed -e "s/__KeyType__/${KEY_TYPE}/g" |
    sed -e "s/__UpdateMetaDataType__/${UPDATE_META_DATA_TYPE}/g" |
    sed -e "s/__ValueType__/${VALUE_TYPE}/g" > ${TARGET_DIR}/$(basename ${FILE_NAME})
done
rm ${TARGET_DIR}/generate.go
goimports -w ${TARGET_DIR}