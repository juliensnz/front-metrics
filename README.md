# Getting Started with Create React App

This project is intended to explore Akeneo PIM codebase.

## Installation

    yarn install

## Usage

### Locale env

    yarn report:generate PATH_YOU_WANT_TO_AUDIT
    yarn start

### Online

You can check the last report for community and enterprise [right here](https://juliensnz.github.io/front-metrics/#/)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Deployment

This app is deployed every night at midnight using master for both community and enterprise

# Todo

- add details for each metrics
- use github to fetch reports in production: https://api.github.com/repos/juliensnz/front-metrics/contents/reports?ref=gh-pages https://stackoverflow.com/questions/39048654/how-to-enable-directory-indexing-on-github-pages
