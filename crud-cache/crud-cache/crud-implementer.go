package crud_cache

type CrudImplementer interface {
	Create(value __ValueType__) (CreateResult, error)
	Delete(key __KeyType__) (deleteActualityTimestamp int64, error error)
	Read(key __KeyType__) (ReadResult, error)
	Update(key __KeyType__, updateMetaData __UpdateMetaDataType__) (ReadResult, error)
}
