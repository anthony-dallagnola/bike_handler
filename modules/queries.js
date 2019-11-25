const fs = require('fs');
const { HTTP, FILE } = require('../config/constants')


function create(req, res, next) {
  try {
    let data = JSON.parse(fs.readFileSync(FILE.PATH, 'utf8'));
    if(data.find(e=>e.id===req.body.id)) {
      logger.error('bike already existing', {_error: 'bike already existing'})
      res.status(HTTP.BAD_REQUEST).end()
    } else {
      data.push(req.body);
      fs.writeFileSync(FILE.PATH, JSON.stringify(data, undefined, 2), 'utf8', err => {
        if(err) {
          logger.error('problem writing to file', { _error: 'problem writing to file' })
          res.status(HTTP.INTERNAL_ERROR).end()
        }
      })
      res.status(HTTP.OK).end()
    }
  }
  catch(err) {
    logger.error('error creating new bike', { _error: err })
    res.status(HTTP.BAD_REQUEST).end()
  }
}

function read(req, res, next) {
  try {
    let data = JSON.parse(fs.readFileSync(FILE.PATH, 'utf8'));
    let bike = data.find(e => e.id === req.params.id);
    if(typeof bike !== 'undefined') {
      res.status(HTTP.OK).json(bike)
    } else {
      logger.error('bike doesn\'t exist', { _error: 'bike doesn\'t exist' })
      res.status(HTTP.NOT_FOUND).end()
    }
  } 
  catch (err) {
    logger.error('error reading bike', { _error: err })
    res.status(HTTP.BAD_REQUEST).end()
  }
}

function readAll(req, res, next) {
  try {
    res.status(HTTP.OK).json(JSON.parse(fs.readFileSync(FILE.PATH, 'utf8')))
  }
  catch (err) {
    logger.error('error reading all bikes', { _error: err })
    res.status(HTTP.BAD_REQUEST).end()
  }
}

function update(req, res, next) {
  try {
    let data = JSON.parse(fs.readFileSync(FILE.PATH, 'utf8'));
    let bike = data.findIndex(e => e.id === req.body.id);
    if ( bike !== -1) {
      data[bike] = {
        ...data[bike],
        ...req.body
      }
      fs.writeFileSync(FILE.PATH, JSON.stringify(data, undefined, 2), 'utf8', err => {
        if (err) {
          logger.error('problem updating to file', { _error: 'problem writing to file' })
          res.status(HTTP.INTERNAL_ERROR).end()
        }
      })
      res.status(HTTP.OK).json(req.body)
    } else {
      logger.error('bike doesn\'t exist', { _error: 'bike doesn\'t exist' })
      res.status(HTTP.NOT_FOUND).end()
    }
  }
  catch (err) {
    logger.error('error updating bike', { _error: err })
    res.status(HTTP.BAD_REQUEST).end()
  }
}

function deleteBike(req, res, next) {
  try {
    let data = JSON.parse(fs.readFileSync(FILE.PATH, 'utf8'));
    let bike = data.findIndex(e => e.id === req.params.id);
    if (bike !== -1) {
      data.splice(bike, 1)
      fs.writeFileSync(FILE.PATH, JSON.stringify(data, undefined, 2), 'utf8', err => {
        if (err) {
          logger.error('problem updating to file', { _error: 'problem writing to file' })
          res.status(HTTP.INTERNAL_ERROR).end()
        }
      })
      res.status(HTTP.OK).end()
    } else {
      logger.error('bike doesn\'t exist', { _error: 'bike doesn\'t exist' })
      res.status(HTTP.NOT_FOUND).end()
    }
  }
  catch (err) {
    logger.error('error deleting bike', { _error: err })
    res.status(HTTP.BAD_REQUEST).end()
  }
}

module.exports = {
  create,
  read,
  readAll,
  update,
  deleteBike
}