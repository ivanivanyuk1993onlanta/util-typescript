#!/usr/bin/env bash
#builtin value type
#go get github.com/ivanivanyuk1993/util-go/crud-cache
bash ../generate.sh \
    --keyType int64 \
    --targetDir . \
    --updateMetaDataType string \
    --valueType *string

#imported value type
#go get github.com/ivanivanyuk1993/util-go/crud-cache
bash ../generate.sh \
    --additionalImportCode 'import "github.com/ivanivanyuk1993/util-go/crud-cache/example"\n' \
    --keyType int64 \
    --targetDir .\
    --updateMetaDataType example.ImportedUpdateMetaDataType \
    --valueType *example.ImportedValueType
