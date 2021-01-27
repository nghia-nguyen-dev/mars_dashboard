"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// global state
var store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
};
// add our markup to the page
var root = document.getElementById('root');
var updateStore = function (store, newState) {
    store = Object.assign(store, newState);
    render(root, store);
};
var render = function (root, state) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        root.innerHTML = App(state);
        return [2 /*return*/];
    });
}); };
// create content
var App = function (state) {
    var rovers = state.rovers, apod = state.apod;
    return "\n        <header></header>\n        <main>\n            " + Greeting(store.user.name) + "\n            <section>\n                <h3>Put things on the page!</h3>\n                <p>Here is an example section.</p>\n                <p>\n                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of\n                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.\n                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other\n                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image\n                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;\n                    but generally help with discoverability of relevant imagery.\n                </p>\n                " + ImageOfTheDay(apod) + "\n            </section>\n        </main>\n        <footer></footer>\n    ";
};
// listening for load event because page should load before any JS is called
window.addEventListener('load', function () {
    render(root, store);
});
// ------------------------------------------------------  COMPONENTS
// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
var Greeting = function (name) {
    if (name) {
        return "\n            <h1>Welcome, " + name + "!</h1>\n        ";
    }
    return "\n        <h1>Hello!</h1>\n    ";
};
// Example of a pure function that renders infomation requested from the backend
var ImageOfTheDay = function (apod) {
    // If image does not already exist, or it is not from today -- request it again
    var today = new Date();
    var photodate = new Date(apod.date);
    console.log(photodate.getDate(), today.getDate());
    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store);
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return ("\n            <p>See today's featured video <a href=\"" + apod.url + "\">here</a></p>\n            <p>" + apod.title + "</p>\n            <p>" + apod.explanation + "</p>\n        ");
    }
    else {
        return ("\n            <img src=\"" + apod.image.url + "\" height=\"350px\" width=\"100%\" />\n            <p>" + apod.image.explanation + "</p>\n        ");
    }
};
// ------------------------------------------------------  API CALLS
// Example API call
var getImageOfTheDay = function (state) {
    var apod = state.apod;
    fetch("http://localhost:3000/apod")
        .then(function (res) { return res.json(); })
        .then(function (apod) {
        console.log(apod);
        updateStore(store, { apod: apod });
    });
    return data;
};
