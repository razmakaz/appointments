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
```
GET /appointments | Returns all appointments.
GET /appointments/{id} | Returns an appointment with specified ID.
POST /appointments | Creates a new appointment.
    - appointment and customer are required.
PATCH /appointments/{id} | Updates an existing appointment with specified ID
    - any field can be updated except id
DELETE /appointments/{id} | Deletes an appointment with specified ID
```  