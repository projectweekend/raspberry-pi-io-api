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
    "email": "something@something.com",
    "subscription": {
        "level": 1,
        "end": "2015-03-13T03:07:26.204Z"
    }
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

### List devices

### View detail of a single device

### Remove a device

### Add a pin configuration to a device

### List pin configurations for a device

### View detail for a single pin configuration

### Remove a pin configuration from a device
