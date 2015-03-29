## Deploy with Heroku

To deploy your own Raspberry Pi IO server first create a Heroku account and install the Heroku Command Line utility. This link has info about how to do that: [https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up). Once installed, follow these steps:

* Clone this repo: `git clone git@github.com:exitcodezero/raspberry-pi-io-api.git`
* Create a new Heroku app using the command line inside the cloned directory: `heroku create whatever-you-name-it`
* Log into the [Heroku Dashboard](https://dashboard.heroku.com/apps/), click on the named app you just created and go to the **Settings** section. Find the **Congif Variables** area, click Edit and add the following variables.
* `JWT_EXPIRES`: The number of minutes for an authentication token to remain valid.
* `JWT_SECRET`: Any random string of characters. This is used to encrypt the authentication tokens.
* `MONGO_URL`: The connection URL for a MongoDB. You can create a free MongoDB at [MongoLab](https://mongolab.com/login/) that will work with this API.
* `NODE_ENV`: Set this to `production`.
* `RABBIT_URL`: The connection URL for a RabbitMQ server. You can create a free RabbitMQ server at [CloudAMQP](http://www.cloudamqp.com/) that will support up to 3 concurrent connections. That's enough for one connection from the controller application and two Raspberry Pi devices.
* `SYSTEM_API_KEY`: Any random string of characters. This will be the value used in the `SYSTEM-API-KEY` header (see below).
* Deploy: `git push heroku master`


## API General Info

* All routes, with the exception of `/pin-config` require an API key be passed in the header `SYSTEM-API-KEY`
* All routes, with the exception of `/pin-config`, `/register`, `/authenticate` require an auth token be passed in the `Authorization` header. The header value should be formatted `Bearer <token>`. A token can be obtained using the `/register` or `/authenticate` routes.
* The `/pin-config` route requires special authentication using three headers. `io-user-email` is the email address of a registered user. `io-device-id` is the ID of a registered device and must also belong to the email in `io-user-email`. `io-user-key` is a secret key generated for a user on the `/user/key` route.


## API Routes


### Register a user

**POST:** `/register`

**Body:**
```json
{
    "email": "something@something.com",
    "password": "$ecR3tP@ssw0rd"
}
```

**Response:**
```json
{
    "token": "somesuperlongauthtokenstring"
}
```

**Status Codes:**
* `201` if successful
* `400` if incorrect data provided
* `409` if email already in use


### Authenticate a user

**POST:** `/authenticate`

**Body:**
```json
{
    "email": "something@something.com",
    "password": "$ecR3tP@ssw0rd"
}
```

**Response:**
```json
{
    "token": "somesuperlongauthtokenstring"
}
```

**Status Codes:**
* `200` if successful
* `400` if incorrect data provided
* `401` if incorrect credentials provided


### Get detail for the authenticated user

**GET:** `/user`

**Response:**
```json
{
    "email": "something@something.com"
}
```

**Status Codes:**
* `200` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing


### Remove the authenticated user

**DELETE:** `/user`

**Response:** None

**Status Codes:**
* `204` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing


### Generate an `io-user-key` for the authenticated user

**POST:** `/user/key`

**Body:** None

**Response:**
```json
{
    "key": "some-secret-user-key"
}
```

**Status Codes:**
* `201` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing


### Register a new device

**POST:** `/user/device`

**Body:** None

**Response:**
```json
{
    "_id": "device_id",
    "userEmail": "something@something.com",
    "pinConfig": []
}
```

**Status Codes:**
* `201` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing


### List devices

**GET:** `/user/device`

**Response:**
```json
[
    {
        "_id": "device_id",
        "userEmail": "something@something.com",
        "pinConfig": []
    }
]
```

**Status Codes:**
* `200` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing


### View detail of a single device

**GET:** `/user/device/:deviceId`

**Response:**
```json
{
    "_id": "device_id",
    "userEmail": "something@something.com",
    "pinConfig": []
}
```

**Status Codes:**
* `200` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing
* `404` if deviceId does not exist


### Remove a device

**DELETE:** `/user/device/:deviceId`

**Response:** None

**Status Codes:**
* `204` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing
* `404` if deviceId does not exist


### Add a pin configuration to a device

**POST:** `/user/device/:deviceId/pin`

**Body:**
```json
{
    "pin": 18,
    "name": "Red LED",
    "mode": "OUT"
}
```

**Response:**
```json
{
    "pin": 18,
    "name": "Red LED",
    "mode": "OUT",
    "initial": "LOW"
}
```

**Required Body Properties:**
* `pin` - Pin number (integer)
* `name` - Custom text label for the pin
* `mode` - `IN` or `OUT`

**Optional Body Properties:**
* `resistor` - `PUD_UP` or `PUD_DOWN`
* `initial` - `HIGH` or `LOW`
* `pinEvent` - `RISING`, `FALLING`, `BOTH`
* `bounce` - Number of milliseconds (integer)


**Status Codes:**
* `201` if successful
* `400` if invalid data
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing


### List pin configurations for a device

**GET:** `/user/device/:deviceId/pin`

**Response:**
```json
[
    {
        "pin": 18,
        "name": "Red LED",
        "mode": "OUT",
        "initial": "LOW"
    }
]
```

**Status Codes:**
* `200` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing
* `404` if deviceId does not exist


### View detail for a single pin configuration

**GET:** `/user/device/:deviceId/pin/:pinId`

**Response:**
```json
{
    "pin": 18,
    "name": "Red LED",
    "mode": "OUT",
    "initial": "LOW"
}
```

**Status Codes:**
* `200` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing
* `404` if deviceId or pinId does not exist


### Remove a pin configuration from a device

**DELETE:** `/user/device/:deviceId/pin/:pinId`

**Response:** None

**Status Codes:**
* `204` if successful
* `401` if not authenticated
* `403` if `SYSTEM-API-KEY` is missing
* `404` if deviceId or pinId does not exist
