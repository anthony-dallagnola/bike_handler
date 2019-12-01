const fs = require('fs');
const { HTTP, FILE, FIELDS, ENCODING, ERRORS, REGEXP, TYPES } = require('../config/constants');
const { generateUUID } = require('../config/functions');

/**
 * @apiVersion 1.0.0
 * @api {post} /bike/create create
 * @apiGroup Bike
 * @apiName PostCreateBike
 * @apiDescription Creates a new bike if it doesn't already exist
 *
 * @apiParam {Object} bike                      the bike to create
 * @apiParam {String} bike.name                 name of the bike
 * @apiParam {String} bike.brand                brand of the bike
 * @apiParam {Number} bike.year                 year the bike was first released
 * @apiParam {String} [bike.motorType]          motor type of the bike
 * @apiParam {String} bike.type                 type of the bike
 * 
 *
 * @apiParamExample {json} Request-Example:
 *   {
 *     "bike": {
 *       "name": "The best",
 *       "brand": "KTM",
 *       "year": 2019,
 *       "type": "mountain"
 *     }
 *   }
 * 
 * @apiSuccess (200) {Object} bike              the newly created bike
 * @apiSuccess (200) {Number} bike.id           id of the bike
 * @apiSuccess (200) {String} bike.name         name of the bike
 * @apiSuccess (200) {String} bike.brand        brand of the bike
 * @apiSuccess (200) {Number} bike.year         year the bike was first released
 * @apiSuccess (200) {String} [bike.motorType]  motor type of the bike
 * @apiSuccess (200) {String} bike.type         id of the bike
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP 200 OK
 *   {
 *     bike: {
 *       "id": "fbf5140f-d7fa-43b8-1b59-7721a870c6f7",
 *       "name": "The best",
 *       "brand": "KTM",
 *       "year": 2019,
 *       "type": "mountain"
 *     }
 *   }
 * 
 * 
 * @apiError (400) {String} error-code           code of the error
 * @apiError (400) {String} error-message        message of the error
 * 
 * @apiError (500) {Void} void
 * 
 * @apiErrorExample {json} Error-Response:
 *   HTTP 400 Bad Request
 *   {
 *     "error-code": "C002"
 *     "error-message": "bike parameters requirements are not met"
 *   }
 * 
 */
function createBike(req, res, next) {
  try {
    // check that we don't have unwanted fields
    for(var key in req.body.bike) {
      if (!FIELDS.includes(key)) {
        throw { customError: ERRORS.CREATE[0] };
      }
    }
    let bike = {
      ...req.body.bike
    }
    // make sure we have the right parameters
    if(!bike.name || typeof bike.name !== 'string' 
      || !bike.brand || typeof bike.brand !== 'string' 
      || !bike.year || typeof bike.year !== 'number'
      || (bike.motorType && typeof bike.motorType !== 'string'
      || !bike.type || typeof bike.type !== 'string')) {
      throw { customError: ERRORS.CREATE[1] };
    }

    let data = JSON.parse(fs.readFileSync(FILE.PATH, ENCODING.UTF8));
    // reorder bike with id first
    bike = {id:generateUUID(), ...bike};
    data.push(bike);
    fs.writeFileSync(FILE.PATH, JSON.stringify(data, undefined, 2), ENCODING.UTF8, err => {
      if(err) {
        return res.status(HTTP.INTERNAL_ERROR).end();
      }
    })
    res.status(HTTP.OK).json({bike});
  }
  catch(err) {
    logger.error('error creating new bike', { _error: err })
    res.status(HTTP.BAD_REQUEST).json({ ...err.customError })
  }
}

/**
 * @apiVersion 1.0.0
 * @api {get} /bike/get get
 * @apiGroup Bike
 * @apiName GetGetBike
 * @apiDescription Return a bike with specific id if it exists
 *
 * @apiParam {String} id id of the bike
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "id": "7ef8e968-7d5b-4bbb-9779-5abe4de457b6"
 *   }
 *
 * @apiSuccess (200) {Object} bike                the bike with the corresponding id
 * @apiSuccess (200) {Number} bike.id             id of the bike
 * @apiSuccess (200) {String} bike.name           name of the bike
 * @apiSuccess (200) {String} bike.brand          brand of the bike
 * @apiSuccess (200) {Number} bike.year           year the bike was first released
 * @apiSuccess (200) {String} [bike.motorType]    motor type of the bike
 * @apiSuccess (200) {String} bike.type           id of the bike
 *
 * @apiError (400) {String} error-code            code of the error
 * @apiError (400) {String} error-message         message of the error
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP 200 OK
 *   {
 *     bike: {
 *       "id": "7ef8e968-7d5b-4bbb-9779-5abe4de457b6",
 *       "name": "Velis",
 *       "brand": "Velis",
 *       "year": 2017,
 *       "type": "mountain"
 *     }
 *   }
 * 
 * @apiErrorExample {json} Error-Response:
 *   HTTP 400 Bad Request
 *   {
 *     "error-code": "R001"
 *     "error-message": "id parameter is not UUID conform"
 *   }
 * 
 * 
 */
function getBike(req, res, next) {
  try {
    if(!REGEXP.UUID.test(req.query.id)) {
      throw { customError: ERRORS.READ[0] };
    }
    let data = JSON.parse(fs.readFileSync(FILE.PATH, ENCODING.UTF8));
    let bike = data.find(e => e.id === req.query.id);
    if(typeof bike !== 'undefined') {
      res.status(HTTP.OK).json(bike);
    } else {
      throw { customError: ERRORS.READ[1] };
    }
  } 
  catch (err) {
    logger.error('error getting bike', { _error: err })
    res.status(HTTP.BAD_REQUEST).json({ ...err.customError });
  }
}

/**
 * @apiVersion 1.0.0
 * @api {get} /bike/getAll getAll
 * @apiGroup Bike
 * @apiName GetGetBikeAll
 * @apiDescription Return all bikes in the database
 *
 * @apiParam {Void} void
 *
 * @apiSuccess (200) {Object} bike                the bike with the corresponding id
 * @apiSuccess (200) {Number} bike.id             id of the bike
 * @apiSuccess (200) {String} bike.name           name of the bike
 * @apiSuccess (200) {String} bike.brand          brand of the bike
 * @apiSuccess (200) {Number} bike.year           year the bike was first released
 * @apiSuccess (200) {String} [bike.motorType]    motor type of the bike
 * @apiSuccess (200) {String} bike.type           id of the bike
 *
 * @apiError (400) {String} error-code            code of the error
 * @apiError (400) {String} error-message         message of the error
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP 200 OK
 *   {
 *     [
 *       {
 *         "id": "7ef8e968-7d5b-4bbb-9779-5abe4de457b6",
 *         "name": "Velis",
 *         "brand": "Velis",
 *         "year": 2017,
 *         "type": "mountain"
 *       },
 *       {
 *         "id": "87beff15-ba80-4449-b9a3-36f0881a1c22",
 *         "name": "S Works",
 *         "brand": "Specialized",
 *         "year": 2019,
 *         "type": "racing"
 *       }
 *     ]
 *   }
 *
 */
function getAllBikes(req, res, next) {
  try {
    res.status(HTTP.OK).json(JSON.parse(fs.readFileSync(FILE.PATH, ENCODING.UTF8)))
  }
  catch (err) {
    logger.error('error getting all bikes', { _error: err })
    res.status(HTTP.BAD_REQUEST).end()
  }
}

/**
 * @apiVersion 1.0.0
 * @api {patch} /bike/update update
 * @apiGroup Bike
 * @apiName PatchUpdateBike
 * @apiDescription Updates a bike if the id exists
 *
 * @apiParam {Number} id                        id of the bike to be updated
 * @apiParam {Object} bike                      the bike to create
 * @apiParam {String} bike.name                 name of the bike
 * @apiParam {String} bike.brand                brand of the bike
 * @apiParam {Number} bike.year                 year the bike was first released
 * @apiParam {String} [bike.motorType]          motor type of the bike
 * @apiParam {String} bike.type                 type of the bike
 *
 *
 * @apiParamExample {json} Request-Example:
 *   {
 *     "id": "906bcbb6-8376-49a8-b085-93089b47fa10",
 *     "bike": {
 *       "name": "Alpha",
 *       "brand": "Specialized",
 *       "year": 2052,
 *       "motorType": "geared",
 *       "type": "racing"
 *     }
 *   }
 *
 * @apiSuccess (200) {Object} bike              the newly updated bike
 * @apiSuccess (200) {Number} bike.id           id of the bike
 * @apiSuccess (200) {String} bike.name         name of the bike
 * @apiSuccess (200) {String} bike.brand        brand of the bike
 * @apiSuccess (200) {Number} bike.year         year the bike was first released
 * @apiSuccess (200) {String} [bike.motorType]  motor type of the bike
 * @apiSuccess (200) {String} bike.type         id of the bike
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP 200 OK
 *   {
 *     bike: {
 *       "id": "fbf5140f-d7fa-43b8-1b59-7721a870c6f7",
 *       "name": "The best",
 *       "brand": "KTM",
 *       "year": 2019,
 *       "type": "mountain"
 *     }
 *   }
 *
 *
 * @apiError (400) {String} error-code           code of the error
 * @apiError (400) {String} error-message        message of the error
 *
 * @apiError (500) {Void} void
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTP 400 Bad Request
 *   {
 *     "error-code": "U001"
 *     "error-message": "bike has extra parameters"
 *   }
 *
 */
function updateBike(req, res, next) {
  try {
    for (var key in req.body.bike) {
      if (!FIELDS.includes(key)) {
        throw { customError: ERRORS.UPDATE[0] };
      }
    }
    if (!REGEXP.UUID.test(req.body.id)) {
      throw { customError: ERRORS.UPDATE[1] };
    }
    let data = JSON.parse(fs.readFileSync(FILE.PATH, ENCODING.UTF8));
    let bike = data.findIndex(e => e.id === req.body.id);
    if ( bike !== -1) {
      data[bike] = {
        ...data[bike],
        ...req.body.bike
      }
      fs.writeFileSync(FILE.PATH, JSON.stringify(data, undefined, 2), ENCODING.UTF8, err => {
        if (err) {
          logger.error('problem updating to file', { _error: 'problem writing to file' });
          return res.status(HTTP.INTERNAL_ERROR).end();
        }
      })
      res.status(HTTP.OK).json({bike:{id: req.body.id, ...req.body.bike}});
    } else {
      throw { customError: ERRORS.UPDATE[2] };
    }
  }
  catch (err) {
    logger.error('error updating bike', { _error: err });
    res.status(HTTP.BAD_REQUEST).json({ ...err.customError });
  }
}

/**
 * @apiVersion 1.0.0
 * @api {patch} /bike/delete delete
 * @apiGroup Bike
 * @apiName DeleteDeleteBike
 * @apiDescription Deletes a bike if the id exists
 *
 * @apiParam {Number} id                        id of the bike to be updates
 *
 *
 * @apiParamExample {json} Request-Example:
 *   {
 *     "id": "906bcbb6-8376-49a8-b085-93089b47fa10",
 *   }
 *
 * @apiSuccess (200) {Object} bike              the newly deleted bike
 * @apiSuccess (200) {Number} bike.id           id of the bike
 * @apiSuccess (200) {String} bike.name         name of the bike
 * @apiSuccess (200) {String} bike.brand        brand of the bike
 * @apiSuccess (200) {Number} bike.year         year the bike was first released
 * @apiSuccess (200) {String} [bike.motorType]  motor type of the bike
 * @apiSuccess (200) {String} bike.type         id of the bike
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP 200 OK
 *   {
 *     bike: {
 *       "id": "fbf5140f-d7fa-43b8-1b59-7721a870c6f7",
 *       "name": "The best",
 *       "brand": "KTM",
 *       "year": 2019,
 *       "type": "mountain"
 *     }
 *   }
 *
 *
 * @apiError (400) {String} error-code           code of the error
 * @apiError (400) {String} error-message        message of the error
 *
 * @apiError (500) {Void} void
 *
 * @apiErrorExample {json} Error-Response:
 *   HTTP 400 Bad Request
 *   {
 *     "error-code": "D001"
 *     "error-message": "id parameter is not UUID conform"
 *   }
 *
 */
function deleteBike(req, res, next) {
  try {
    if (!REGEXP.UUID.test(req.params.id)) {
      throw { customError: ERRORS.DELETE[0] };
    }
    let data = JSON.parse(fs.readFileSync(FILE.PATH, ENCODING.UTF8));
    let bikeIndex = data.findIndex(e => e.id === req.params.id);
    if (bikeIndex !== -1) {
      let bike = data[bikeIndex];
      data.splice(bikeIndex, 1)
      fs.writeFileSync(FILE.PATH, JSON.stringify(data, undefined, 2), ENCODING.UTF8, err => {
        if (err) {
          logger.error('problem updating to file', { _error: 'problem writing to file' })
          return res.status(HTTP.INTERNAL_ERROR).end()
        }
      })
      res.status(HTTP.OK).json({bike});
    } else {
      throw { customError: ERRORS.DELETE[1] };
    }
  }
  catch (err) {
    logger.error('error deleting bike', { _error: err })
    res.status(HTTP.BAD_REQUEST).json({ ...err.customError });
  }
}

module.exports = {
  create: createBike,
  get: getBike,
  getAll: getAllBikes,
  update: updateBike,
  delete: deleteBike
}