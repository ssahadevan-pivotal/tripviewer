# TripViewer

## A sample app using the Automatic REST API

Tripviewer is a node.js app that allows users to view and export trips taken using [Automatic](http://automatic.com).  It demonstrates the use of the [Automatic REST API](http://developer.automatic.com).

## Demo

A demo version of this application is available at [https://tripviewer.herokuapp.com](https://tripviewer.herokuapp.com).

### Install node and gulp

    brew install node

    npm install gulp -g


### Install required modules

    npm install

### Configure your client id and client secret

Copy the file `config-sample.json` to `config.json` and add your Automatic client id and client secret.  Alternatively, create environment variables named `AUTOMATIC_CLIENT_ID`, `AUTOMATIC_CLIENT_SECRET` and `MAPBOX_ACCESS_TOKEN`.

    cp config-sample.json config.json

Get a [mapbox access token](https://www.mapbox.com/signup/) and add it to the `config.json` file.

### Run the app

    DEBUG=tripviewer gulp develop

### View the app

Open `localhost:3000` in your browser.

### Caching

Trips are cached in the browser using localstorage. To clear that, open the developer console and type:

    localStorage.clear()

### Testing locally, skipping oAuth

You can test locally as a logged in user, bypassing OAuth by including an `access_token` when running the app.

    DEBUG=tripviewer TOKEN=YOUR-AUTOMATIC-ACCESS-TOKEN gulp develop

### Deploy to Heroku

If you have the [heroku toolbelt](https://toolbelt.heroku.com/) installed, you can create, configure and deploy this app to Heroku.  To create an app:

    heroku create

If you already created an app, add it as a git remote:

    git remote add heroku YOUR-HEROKU-GIT-URL

Configure the heroku app's environment variables:

    heroku config:add AUTOMATIC_CLIENT_ID="YOUR AUTOMATIC CLIENT ID"
    heroku config:add AUTOMATIC_CLIENT_SECRET="YOUR AUTOMATIC CLIENT SECRET"

Deploy your app to heroku:

    git push heroku master

See [deploying a node.js app](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) for more information.

## License

This project is licensed under the terms of the Apache 2.0 license.
