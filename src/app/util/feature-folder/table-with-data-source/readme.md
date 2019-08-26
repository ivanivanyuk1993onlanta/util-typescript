# Table with data source requirements
1. Should be fully customizable, from table template to row and col template
1. Should be enough to implement tree table
1. Should not prevent drag and drop
# Data source requirements
1. Should have public dataListContinuous$
1. Should have optional selection data source
    - Selection data source should have methods
      1. isSelectedContinuous$(row) + pure pipe
      1. ...
    - Implementation examples
      1. Implementation like in file system should exist(Ctrl+Click, Shift+Click, Ctrl+Shift+Click)
      1. Implementation with check boxes should exist, with master checkbox like in https://material.angular.io/components/table/overview#selection
      1. Both implementations for tree list should exist
1. Should have optional pagination data source
    - ...
1. Should have optional sorting data source
    - ...
1. Should have optional filter data source
    - ...
1. Should have special data source for cases like move row before other row or update cell value 
    - ...
