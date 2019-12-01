# util-typescript
This project is not to be used/edited as not part of other projects, hence it doesnt't have neither npm, nor tsconfig

# Expected workflow
1. Clone this repo to some directory in parent repo
1. Edit files in parent repo
1. Open this repos' root in terminal/IDE, commit changes in this repo separately for parent and child

# Why this approach instead of subtree/submodules
- Submodules do not store files, only references to repo, which limits it's use cases
- Subtree is too complicated to work with (it is to easy to break history with it)
- This solution gives more control, like hard reset of local child changes, or using local child repo branches with differences and even cherrypicking some of them

