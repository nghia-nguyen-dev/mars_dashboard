# Mars Rover Dashboard

A simple dashboard UI that fetches rover data from the NASA Mars Rover Photos API

## Installation

1. Clone this repo
2. `Npm install`
3. Then spin up the server with `npm run start` in the terminal
4. Open browser and navigate to **localhost:3000**
5. Optional: Typescript file can be compiled into different flavors of JS by updating the *target* in tsconfig to work on your preferred browser. Then just run the command `tsc`.

## Usage

- Click on any one of the 3 rovers to see latest photos and info

## Notes

- API can only fetch a max of 25 photos
- Each rover will display different numbers of photos base on what is available
- Latest photos are provide in earth year instead of Sol(day on Mars)
- Images do not specify which camera it was taken from (9 different cameras!)

## Tech

- html
- css/scss
- javascript/ typescript
