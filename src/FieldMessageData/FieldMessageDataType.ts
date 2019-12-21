// todo add constants fieldIdIndex and fieldValueIndex
// todo add readme
// todo add generic ValueType = unknown

/**
 * This type should be used to exchange data between machines through the net
 * to save traffic when Protobuf or other binary format is not available
 */
export type FieldMessageDataType = [number, unknown];
