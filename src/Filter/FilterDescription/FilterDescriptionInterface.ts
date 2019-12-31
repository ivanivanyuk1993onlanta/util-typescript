/**
 * Interface to describe filters for query builders
 */
import { LogicalJoinTypeEnum } from "./LogicalJoinTypeEnum";

export interface FilterDescriptionInterface<
  FilterDataType,
  FilterDescriptionType
> {
  /**
   * Filter data for type, like {fieldId,fieldValue} for ConditionEquals, or FilterData[] for ConditionGroup
   */
  filterData: FilterDataType;
  /**
   * Type of filter data, like ConditionEquals, or ConditionGroup
   */
  filterType: FilterDescriptionType;
  /**
   * Type of logical join, like filterCondition1 && filterCondition2 || filterCondition3 && filterCondition4
   */
  logicalJoinType: LogicalJoinTypeEnum;
}
