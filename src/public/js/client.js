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
const removeActiveClass = () => {
    document.querySelector('.active')?.classList.remove('active');
};
const main = (e) => {
    removeActiveClass();
    e.target.classList.add(`active`);
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
        <p>Status: <span class="status">${roverInfo.rover.status}</span</p>
        <p>Date of photos: <span class="dim-txt">${roverInfo.earth_date}</span></p>
        <p>Launch date: <span class="dim-txt">${roverInfo.rover.launch_date}</span></p>
        <p>Landing date: <span class="dim-txt">${roverInfo.rover.landing_date}</span></p>
    `;
};
const convertDateFormat = (date) => {
    const dateArr = date.split(`-`);
    return `${dateArr[1]}-${dateArr[2]}-${dateArr[0]}`;
};
const App = (state) => {
    console.log(state.toJS());
    return `
        <section>
        <div class="details">
            ${buildInfoTag(state)}
        </div>
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
