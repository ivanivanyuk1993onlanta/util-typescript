#!/usr/bin/env bash
bash ../generate.sh \
    --additionalImportCode 'import "github.com/ivanivanyuk1993/util-go/crud-cache/test/data-type/test-model"\n' \
    --keyType uint64 \
    --targetDir .\
    --updateMetaDataType int64 \
    --valueType test_model.TestModel
