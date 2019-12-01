define({ "api": [
  {
    "version": "1.0.0",
    "type": "patch",
    "url": "/bike/delete",
    "title": "delete",
    "group": "Bike",
    "name": "DeleteDeleteBike",
    "description": "<p>Deletes a bike if the id exists</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>id of the bike to be updates</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"id\": \"906bcbb6-8376-49a8-b085-93089b47fa10\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "bike",
            "description": "<p>the newly deleted bike</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.id",
            "description": "<p>id of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.name",
            "description": "<p>name of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.brand",
            "description": "<p>brand of the bike</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.year",
            "description": "<p>year the bike was first released</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "bike.motorType",
            "description": "<p>motor type of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.type",
            "description": "<p>id of the bike</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n{\n  bike: {\n    \"id\": \"fbf5140f-d7fa-43b8-1b59-7721a870c6f7\",\n    \"name\": \"The best\",\n    \"brand\": \"KTM\",\n    \"year\": 2019,\n    \"type\": \"mountain\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-code",
            "description": "<p>code of the error</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-message",
            "description": "<p>message of the error</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Void",
            "optional": false,
            "field": "void",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error-code\": \"D001\"\n  \"error-message\": \"id parameter is not UUID conform\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./modules/queries.js",
    "groupTitle": "Bike"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/bike/get",
    "title": "get",
    "group": "Bike",
    "name": "GetGetBike",
    "description": "<p>Return a bike with specific id if it exists</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of the bike</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"id\": \"7ef8e968-7d5b-4bbb-9779-5abe4de457b6\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "bike",
            "description": "<p>the bike with the corresponding id</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.id",
            "description": "<p>id of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.name",
            "description": "<p>name of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.brand",
            "description": "<p>brand of the bike</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.year",
            "description": "<p>year the bike was first released</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "bike.motorType",
            "description": "<p>motor type of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.type",
            "description": "<p>id of the bike</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n{\n  bike: {\n    \"id\": \"7ef8e968-7d5b-4bbb-9779-5abe4de457b6\",\n    \"name\": \"Velis\",\n    \"brand\": \"Velis\",\n    \"year\": 2017,\n    \"type\": \"mountain\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-code",
            "description": "<p>code of the error</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-message",
            "description": "<p>message of the error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error-code\": \"R001\"\n  \"error-message\": \"id parameter is not UUID conform\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./modules/queries.js",
    "groupTitle": "Bike"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/bike/getAll",
    "title": "getAll",
    "group": "Bike",
    "name": "GetGetBikeAll",
    "description": "<p>Return all bikes in the database</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Void",
            "optional": false,
            "field": "void",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "bike",
            "description": "<p>the bike with the corresponding id</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.id",
            "description": "<p>id of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.name",
            "description": "<p>name of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.brand",
            "description": "<p>brand of the bike</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.year",
            "description": "<p>year the bike was first released</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "bike.motorType",
            "description": "<p>motor type of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.type",
            "description": "<p>id of the bike</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n{\n  [\n    {\n      \"id\": \"7ef8e968-7d5b-4bbb-9779-5abe4de457b6\",\n      \"name\": \"Velis\",\n      \"brand\": \"Velis\",\n      \"year\": 2017,\n      \"type\": \"mountain\"\n    },\n    {\n      \"id\": \"87beff15-ba80-4449-b9a3-36f0881a1c22\",\n      \"name\": \"S Works\",\n      \"brand\": \"Specialized\",\n      \"year\": 2019,\n      \"type\": \"racing\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-code",
            "description": "<p>code of the error</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-message",
            "description": "<p>message of the error</p>"
          }
        ]
      }
    },
    "filename": "./modules/queries.js",
    "groupTitle": "Bike"
  },
  {
    "version": "1.0.0",
    "type": "patch",
    "url": "/bike/update",
    "title": "update",
    "group": "Bike",
    "name": "PatchUpdateBike",
    "description": "<p>Updates a bike if the id exists</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>id of the bike to be updated</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "bike",
            "description": "<p>the bike to create</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bike.name",
            "description": "<p>name of the bike</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bike.brand",
            "description": "<p>brand of the bike</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "bike.year",
            "description": "<p>year the bike was first released</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "bike.motorType",
            "description": "<p>motor type of the bike</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bike.type",
            "description": "<p>type of the bike</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"id\": \"906bcbb6-8376-49a8-b085-93089b47fa10\",\n  \"bike\": {\n    \"name\": \"Alpha\",\n    \"brand\": \"Specialized\",\n    \"year\": 2052,\n    \"motorType\": \"geared\",\n    \"type\": \"racing\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "bike",
            "description": "<p>the newly updated bike</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.id",
            "description": "<p>id of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.name",
            "description": "<p>name of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.brand",
            "description": "<p>brand of the bike</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.year",
            "description": "<p>year the bike was first released</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "bike.motorType",
            "description": "<p>motor type of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.type",
            "description": "<p>id of the bike</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n{\n  bike: {\n    \"id\": \"fbf5140f-d7fa-43b8-1b59-7721a870c6f7\",\n    \"name\": \"The best\",\n    \"brand\": \"KTM\",\n    \"year\": 2019,\n    \"type\": \"mountain\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-code",
            "description": "<p>code of the error</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-message",
            "description": "<p>message of the error</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Void",
            "optional": false,
            "field": "void",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error-code\": \"U001\"\n  \"error-message\": \"bike has extra parameters\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./modules/queries.js",
    "groupTitle": "Bike"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/bike/create",
    "title": "create",
    "group": "Bike",
    "name": "PostCreateBike",
    "description": "<p>Creates a new bike if it doesn't already exist</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "bike",
            "description": "<p>the bike to create</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bike.name",
            "description": "<p>name of the bike</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bike.brand",
            "description": "<p>brand of the bike</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "bike.year",
            "description": "<p>year the bike was first released</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "bike.motorType",
            "description": "<p>motor type of the bike</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bike.type",
            "description": "<p>type of the bike</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"bike\": {\n    \"name\": \"The best\",\n    \"brand\": \"KTM\",\n    \"year\": 2019,\n    \"type\": \"mountain\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "bike",
            "description": "<p>the newly created bike</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.id",
            "description": "<p>id of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.name",
            "description": "<p>name of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.brand",
            "description": "<p>brand of the bike</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "bike.year",
            "description": "<p>year the bike was first released</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "bike.motorType",
            "description": "<p>motor type of the bike</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "bike.type",
            "description": "<p>id of the bike</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n{\n  bike: {\n    \"id\": \"fbf5140f-d7fa-43b8-1b59-7721a870c6f7\",\n    \"name\": \"The best\",\n    \"brand\": \"KTM\",\n    \"year\": 2019,\n    \"type\": \"mountain\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-code",
            "description": "<p>code of the error</p>"
          },
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error-message",
            "description": "<p>message of the error</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Void",
            "optional": false,
            "field": "void",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 400 Bad Request\n{\n  \"error-code\": \"C002\"\n  \"error-message\": \"bike parameters requirements are not met\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./modules/queries.js",
    "groupTitle": "Bike"
  }
] });
