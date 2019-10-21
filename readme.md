This project is not to be used/edited as not part of other projects, hence it doesnt't have neither npm, nor tsconfig

Helpful scripts to work with subtree
```
# add
git subtree add --prefix util-typescript https://github.com/ivanivanyuk1993/util-typescript.git dev --squash

# pull
git subtree pull --prefix util-typescript https://github.com/ivanivanyuk1993/util-typescript.git dev --squash

# push
git subtree push --prefix util-typescript git@github.com:ivanivanyuk1993/util-typescript.git push-branch
