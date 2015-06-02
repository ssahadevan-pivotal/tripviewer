# TripViewer

## A sample app using the Automatic REST API

Tripviewer is a node.js app that allows users to view and export trips taken using [Automatic](http://automatic.com).  It demonstrates the use of the [Automatic REST API](http://developer.automatic.com).

## Demo

A demo version of this application is available at [https://tripviewer.herokuapp.com](https://tripviewer.herokuapp.com).


## One-Click deploy to Heroku

Click this button to instantly deploy this app to Heroku. You'll need an [Automatic client ID and secret](http://developer.automatic.com) as well as a [mapbox access token](https://www.mapbox.com/signup/).

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

After deploying, you will need to use the Automatic [Developer Apps Manager](https://developer.automatic.com/my-apps/) to set your application's redirect URL to match the Heroku app name you selected when deploying. For instance, if you name your app `tripviewer-test` in Heroku your redirect URL should be `https://tripviewer-test.herokuapp.com/redirect`. Note that the URL must start with `https`.


## Running Locally

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

### Testing locally, skipping OAuth

You can test locally as a logged in user, bypassing OAuth by including an `access_token` when running the app.

    DEBUG=tripviewer TOKEN=YOUR-AUTOMATIC-ACCESS-TOKEN gulp develop

### Support

Please write to developer@automatic.com if you have any questions or need help.

## License

This project is licensed under the terms of the Apache 2.0 license.
