import { MaterialUsedModule } from './material-used.module';

describe('MaterialUsedModule', () => {
  let materialUsedModule: MaterialUsedModule;

  beforeEach(() => {
    materialUsedModule = new MaterialUsedModule();
  });

  it('should create an instance', () => {
    expect(materialUsedModule).toBeTruthy();
  });
});
