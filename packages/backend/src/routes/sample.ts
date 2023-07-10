import { Router } from "express";
const sample = Router()

sample.get('/', (req, res) => {
  res.json({
    data: 'hello world'
  })
})

export default sample