"use strict";
var root = document.getElementById("root");
var rovers = document.querySelector(".rovers");
// --------------------------------------------- global state
var store = Immutable.fromJS({
    rovers: {
        curiosity: {},
        opportunity: {},
        spirit: {},
    },
    active: "",
});
// --------------------------------------------- Fetch API
var fetchData = function (state) {
    var options = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
    };
    fetch("http://localhost:3000/rover", options)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        render(updateStore(state, { roverInfo: data, type: "SET_ROVER" }));
    })
        .catch(function (err) { return console.log(err); });
};
// --------------------------------------------- Helper f
var removeActiveClass = function () {
    var _a;
    (_a = document.querySelector('.active')) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
};
var convertDateFormat = function (date) {
    var dateArr = date.split("-");
    return dateArr[1] + "-" + dateArr[2] + "-" + dateArr[0];
};
// --------------------------------------------- Main
var main = function (e) {
    removeActiveClass();
    e.target.classList.add("active");
    var roverName = e.target.dataset.rover;
    var state = updateStore(store, { active: roverName, type: "SET_ACTIVE" });
    fetchData(state);
};
var updateStore = function (state, action) {
    // Both set() + setIn() returns a new MAP object
    if (action.type === "SET_ACTIVE") {
        return state.set("active", Immutable.fromJS(action.active));
    }
    else if (action.type === "SET_ROVER") {
        return state.setIn(["rovers", "" + state.get("active")], Immutable.fromJS(action.roverInfo));
    }
    else {
        return state;
    }
};
var render = function (state) {
    root.innerHTML = App(state);
};
var App = function (state) {
    return "\n        <section>\n        <div class=\"details\">\n            " + buildInfoTag(state) + "\n        </div>\n            <div class=\"rover-images\">\n                " + buildImgTag(state) + "\n            </div>\n        </section>\n    ";
};
// --------------------------------------------- Components
var buildImgTag = function (state) {
    state = state.toJS();
    // Destructuring to pull out latest_photos array
    var _a = state, _b = state.active, latest_photos = _a.rovers[_b].latest_photos;
    return latest_photos.reduce(function (accumulator, currentPhoto) {
        return accumulator + ("<img src=\"" + currentPhoto.img_src + "\">");
    }, ""); // initialize with empty string!!!
};
var buildInfoTag = function (state) {
    state = state.toJS();
    // Destructuring to pull out 1st item in the latest_photos array
    var _a = state, _b = state.active, roverInfo = _a.rovers[_b].latest_photos[0];
    return "\n        <p>Status: <span class=\"status\">" + roverInfo.rover.status + "</span</p>\n        <p>Date of photos: <span class=\"dim-txt\">" + convertDateFormat(roverInfo.earth_date) + "</span></p>\n        <p>Launch date: <span class=\"dim-txt\">" + convertDateFormat(roverInfo.rover.launch_date) + "</span></p>\n        <p>Landing date: <span class=\"dim-txt\">" + convertDateFormat(roverInfo.rover.landing_date) + "</span></p>\n    ";
};
// --------------------------------------------- Listeners
window.addEventListener("load", function () {
    rovers.addEventListener("click", main);
});
