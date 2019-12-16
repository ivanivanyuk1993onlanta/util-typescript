/**
 * Interface to describe filters for query builders
 */
export interface FilterDescriptionInterface<
  FilterDataType,
  FilterDescriptionType
> {
  /**
   * Filter data for type, like FieldMessageDataType for ConditionEquals, or FilterData[] for ConditionGroup
   */
  filterData: FilterDataType;
  /**
   * Type of filter data, like ConditionEquals, or ConditionGroup
   */
  filterType: FilterDescriptionType;
}
