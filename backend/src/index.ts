import './load-env'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import UserController from './interfaces/http/controllers/UserController';
import http from 'http'

import { Server } from "socket.io";
// Load environment variables from .env file


const app = express();
const port = process.env.PORT;
const version = '/v1/'

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://127.0.0.1:5173',
}))
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173'
  }
});
app.use(morgan('dev'));

// Routes
app.post('/users', UserController.createUser);
app.get('/users/:userId', UserController.getUser);

io.on('connection', (socket) => {
  console.log('a user connected', socket);
});

// Start server
server.listen(port, () => {
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
