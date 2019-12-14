package crud_cache

type CrudCacheConfig struct {
	CrudImplementer CrudImplementer
	RefreshTime     int64
	SpoilTime       int64
	Timeout         int64
}
