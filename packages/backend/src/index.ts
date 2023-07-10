import express, { Express } from 'express';
import routes from './routes';
import cors from 'cors'

import './load-env'

const app: Express = express();
const port = process.env.PORT;
const version = '/v1/'

app.use(cors())

Object.entries(routes).forEach(([path, router]) => {
  app.use(version + path, router)
})

app.listen(port, () => {
  function print (path: any, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
      console.log('%s /%s',
        layer.method.toUpperCase(),
        path.concat(split(layer.regexp)).filter(Boolean).join('/'))
    }
  }
  
  function split (thing: any) {
    if (typeof thing === 'string') {
      return thing.split('/')
    } else if (thing.fast_slash) {
      return ''
    } else {
      var match = thing.toString()
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '$')
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
      return match
        ? match[1].replace(/\\(.)/g, '$1').split('/')
        : '<complex:' + thing.toString() + '>'
    }
  }
  
  console.log(`⚡️[server]: Server is running at http://localhost:${port}${version}`);
  app._router.stack.forEach(print.bind(null, []))
});