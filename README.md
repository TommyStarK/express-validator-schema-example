# express-validator-schema-example

Simple example of how to perform a schema based data input validation with a dedicated middleware to handle
the HTTP response in case of failure.


## Usage

- Install, build and run the app
```bash
$ npm i && npm run build && npm run start
```

- A successful HTTP request

```bash
$ curl --verbose --header "Content-Type: application/json" \
  --request GET \
  --data '{
    "feed": {
        "id": "et654d221Vg76",
        "stars": 17,
        "subscriptions": [
          {
             "email": "test@dummy.co",
             "options": ["a", "b", "c", "d"]
          },
          {
             "email": "test@dummy.fr",
             "options": ["b", "c"]
          }
        ]
     }
  }' \
  "http://localhost:3000/checkInput"
```

- A HTTP request which will have a code 422 as response

```bash
$ curl --verbose --header "Content-Type: application/json" \
  --request GET \
  --data '{
    "feed": {
        "id": "et654d221Vg76",
        "stars": "invalid integer",
        "subscriptions": [
          {
             "email": "test",
             "options": ["a", "b", "c", "d"]
          },
          {
             "email": "test@dummy.fr",
             "options": ["b", "invalid option"]
          }
        ]
     }
  }' \
  "http://localhost:3000/checkInput"
```
