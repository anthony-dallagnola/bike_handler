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

module.exports = {
  HTTP,
  FILE
} 