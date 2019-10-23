# Administrator's dashboard

> The administrator panel to manage resources on API

## Game collection

- games collection (/game)
  - games (/games)
    - (/add)
    - (/edit/:id)
    - (/:id)
  - editor (/editors)
    - (/add)
    - (/edit/:id)
    - (/:id)
  - platform (/platforms)
    - (/add)
    - (/edit/:id)
    - (/:id)
  - tag (/tags)
    - (/add)
    - (/edit/:id)
    - (/:id)
    
## Docker image

- expose on 80 port
- no environment variables
- image on docker hub at `retrobox/admin`

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
