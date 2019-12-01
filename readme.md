This project is not to be used/edited as not part of other projects, hence it doesnt't have neither npm, nor tsconfig

Helpful scripts to work with sub-tree are placed in .sub-tree

How to work with .sub-tree
On first run
- Clone repo into desired folder
- Copy `/.sub-tree/variable-file.sh.example` to `/.sub-tree/variable-file.sh`
- Fill `/.sub-tree/variable-file.sh` with actual values
- Then run `/.subtree/add.sh` from parent repo root (skipping this step will break history and force you to manually push unsaved changes to child repo, then repeating steps)

To work run `/.subtree/pull.sh` or `/.subtree/push.sh` from parent repo root
