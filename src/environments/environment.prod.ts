import * as logTypeWithUiPermissionDataProto from '../app/model/proto/log-type/log-type-with-ui-permission-data_pb.js';

export const environment = {
  apiUrl: 'http://localhost:8080',
  production: true,
  tableNameToTableProtoMap: {
    'log_type': logTypeWithUiPermissionDataProto.LogTypeWithUiPermissionData,
  },
  tableNameToTableUrlMap: {
    'log_type': 'log-type',
  },
};
