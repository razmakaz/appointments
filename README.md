# Setup
## Install
Run `yarn install` to install of the necessary dependencies.

## Starting the server
Run `yarn start` to start the server. 

It will automatically create the database and seed it with 100 randomly generated appointments.

## Resetting the Database
You can either delete `db.db` and rerun the application or run `yarn clean` to completely reset the database with 100 randomly
generated appointments.

# Data Structure 
```
{
    id: 'a4387602-975c-4e8c-a022-ddb27eb9dea1',
    appointment: '2022-09-29T11:03:30.814Z',
    description: 'Autem rem sit soluta dicta neque et.',
    customer: 'Alberta Hintz Jr.',
    image: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/60.jpg'
}
```

# Endpoints
There's a postman file you can use to see more information about the endpoints.
```
GET /appointments
GET /appointments/{id}
GET /appointments/by_date/{date}
POST /appointments
PATCH /appointments/{id}
DELETE /appointments/{id}
```