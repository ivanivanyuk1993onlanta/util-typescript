# What it should do

It should offer a cache like guava-async-loading-cache for TypeScript

# Ways to do it, from good to bad

- Convert existing library (https://github.com/ben-manes/caffeine) to wasm, write interface to use it in TypeScript
- Convert existing library (https://github.com/ben-manes/caffeine) to TypeScript - tried, failed
- Write own library from go implementation/previous implementation
