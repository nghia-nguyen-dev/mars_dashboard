"use strict";
const root = document.getElementById("root");
const rovers = document.querySelector(".rovers");
// global state
const store = Immutable.fromJS({
    rovers: {
        curiosity: {},
        opportunity: {},
        spirit: {},
    },
    active: ``,
});
const fetchData = (state) => {
    const options = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
    };
    fetch(`http://localhost:3000/rover`, options)
        .then((res) => res.json())
        .then((data) => {
        render(updateStore(state, { roverInfo: data, type: `SET_ROVER` }));
    })
        .catch((err) => console.log(err));
};
const main = (e) => {
    const roverName = e.target.dataset.rover;
    const state = updateStore(store, { active: roverName, type: `SET_ACTIVE` });
    fetchData(state);
};
const updateStore = (state, action) => {
    // Both set() + setIn() returns a new MAP object
    if (action.type === `SET_ACTIVE`) {
        return state.set(`active`, Immutable.fromJS(action.active));
    }
    else if (action.type === `SET_ROVER`) {
        console.log(action.roverInfo);
        return state.setIn([`rovers`, `${state.get(`active`)}`], Immutable.fromJS(action.roverInfo));
    }
    else {
        return state;
    }
};
const render = (state) => {
    root.innerHTML = App(state);
};
const buildImgTag = (state) => {
    state = state.toJS();
    // Destructuring to pull out latest_photos array
    const { rovers: { [state.active]: { latest_photos }, }, } = state;
    return latest_photos.reduce((accumulator, currentPhoto) => {
        return accumulator + `<img src="${currentPhoto.img_src}">`;
    }, ``); // initialize with empty string!!!
};
const buildInfoTag = (state) => {
    state = state.toJS();
    // Destructuring to pull out 1st item in the latest_photos array
    const { rovers: { [state.active]: { latest_photos: [roverInfo], }, }, } = state;
    return `
        <h2>${state.active}</h2>
        <p>Status: ${roverInfo.rover.status}</p>
        <p>Date of photos: ${roverInfo.earth_date}</p>
        <p>Launch date: ${roverInfo.rover.launch_date}</p>
        <p>Landing date: ${roverInfo.rover.landing_date}</p>
    `;
};
const App = (state) => {
    console.log(state.toJS());
    return `
        <section>
            ${buildInfoTag(state)}
            <div class="rover-images">
                ${buildImgTag(state)}
            </div>
        </section>
    `;
};
// Listeners
window.addEventListener("load", () => {
    rovers.addEventListener("click", main);
});
