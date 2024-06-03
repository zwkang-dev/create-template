---
outline: deep
---

# Usage Examples

This page demonstrates usage of create-template cli

## Create a new template

create a new template for your library

````bash
zct generator [template-name] [target-directory] [options]
````

options:

- `--internal` 
  - default first use user custom cache template
  - you can set internal flag to use internal template first
- `--empty-dest`
  - clean dest folder before copy template


## load template

support 4 ways to install a template

- zip link
- git link
- git repo
- local path

### zip link

````bash
zct download-zip [link]
````

### git link

````bash
zct download-git [link]
````

### git repo

````bash
zct load-git [repo]
````

- repo: git repo url

- examples: zct load-git zwkang/ts-lib-template

### local path

````bash
zct load-template [path]
````

- path: local path

- examples: zct load-template ./template


## list all template

list all template in cache

````bash
zct list-templates
````
