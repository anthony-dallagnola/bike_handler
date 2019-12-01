const HTTP = {
  OK             : 200,
  BAD_REQUEST    : 400,
  UNAUTHORIZED   : 401,
  FORBIDDEN      : 403,
  NOT_FOUND      : 404,
  INTERNAL_ERROR : 500
}

const FILE = {
  PATH: 'DB/bikesdatabase.json',
  ORIGINAL_PATH: 'DB/bikesdatabase.orig.json'
}

const FIELDS = [
  'name',
  'brand',
  'year',
  'motorType',
  'type'
]

const ENCODING = {
  UTF8: 'utf8'
}

const REGEXP = {
  // not strictly uuid (RFC4122)
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  // UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
}

const ERRORS = {
  CREATE: [
    {
      'error-code': 'C001',
      'error-message': 'bike has extra parameters'
    },
    {
      'error-code': 'C002',
      'error-message': 'bike parameters requirements are not met'
    }
  ],
  READ: [
    {
      'error-code': 'R001',
      'error-message': 'id parameter is not UUID conform'
    },
    { 
      'error-code': 'R002',
      'error-message': 'id is not registered'
    }
  ],
  UPDATE: [
    {
      'error-code': 'U001',
      'error-message': 'bike has extra parameters'
    },
    {
      'error-code': 'U002',
      'error-message': 'id parameter is not UUID conform'
    },
    {
      'error-code': 'U003',
      'error-message': 'id is not registered'
    }
  ],
  DELETE: [
    {
      'error-code': 'D001',
      'error-message': 'id parameter is not UUID conform'
    },
    {
      'error-code': 'D002',
      'error-message': 'id is not registered'
    }
  ]
}

const TYPES = {
  ERROR: {
    CODE: 'error-code',
    MESSAGE: 'error-message'
  }
}

module.exports = {
  HTTP,
  FILE,
  FIELDS,
  ENCODING,
  ERRORS,
  REGEXP,
  TYPES
} 