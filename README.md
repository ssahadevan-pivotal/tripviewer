# TripViewer

## A sample app using the Automatic REST API

Tripviewer is a node.js app that allows users to view and export trips taken using [Automatic](http://automatic.com).  It demonstrates the use of the [Automatic REST API](http://developer.automatic.com).

## Demo

A demo version of this application is available at [https://tripviewer.herokuapp.com](https://tripviewer.herokuapp.com).

## Running


### Prerequisites

Install node.js

    brew install node

Install Gulp

    npm install gulp -g

### Install required modules

    npm install

### Configure your client id and client secret

Copy the file `config-sample.json` to `config.json` and add your Automatic client id and client secret.  Alternatively, create environment variables named `AUTOMATIC_CLIENT_ID` and `AUTOMATIC_CLIENT_SECRET`.

    cp config-sample.json config.json

### Run the app

    DEBUG=tripviewer gulp

### View the app

Open `localhost:3000` in your browser.

### Caching

Trips are cached in the browser using localstorage. To clear that, open the developer console and type:

    localStorage.clear()

### Testing locally, skipping oAuth

You can test locally as a logged in user, bypassing oAuth by including an `access_token` when running the app.

    DEBUG=tripviewer TOKEN=YOUR-AUTOMATIC-ACCESS-TOKEN gulp

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

The MIT License (MIT)

Copyright (c) 2014 Automatic Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
