"use strict";
const root = document.getElementById("root");
const rovers = document.querySelector(".rovers");
// global state
const store = Immutable.fromJS({
    rovers: {
        curiosity: null,
        opportunity: null,
        spirit: null,
    },
    active: null,
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
        updateStore(state, {
            rovers: {
                [state.active]: data,
            },
        });
    })
        .catch((err) => console.log(err));
};
const cb = (e) => {
    console.log(e);
    const roverName = e.target.dataset.rover;
    const currentState = updateStore(store, { active: roverName });
    // Check if rover info already exist to avoid unecessary fetching
    if (currentState.rovers[roverName] !== null) {
        render(currentState);
    }
    else {
        fetchData(currentState);
    }
};
const updateStore = (prevState, newState) => {
    prevState = Immutable.fromJS(prevState); // convert back to Immutable
    const currentState = prevState.mergeDeep(newState).toJS(); // convert back to raw JS objects after merge
    render(currentState);
    return currentState;
};
const render = async (state) => {
    root.innerHTML = App(state);
};
const buildImgTag = (state) => {
    return photos.reduce((accumulator, currentPhoto) => {
        return accumulator + `<img src="${currentPhoto.img_src}">`;
    }, ``); // initialize with empty string!
};
const buildInfoTag = (state) => {
    const active = state.active;
    // Destructuring to pull out 1st item in the latest_photos array
    const { rovers: { [active]: { latest_photos: [roverInfo] } } } = state;
    return `
        <h2>${active}</h2>
        <p>Status: ${roverInfo.rover.status}</p>
        <p>Date of photos: ${roverInfo.earth_date}</p>
        <p>Launch date: ${roverInfo.rover.launch_date}</p>
        <p>Landing date: ${roverInfo.rover.landing_date}</p>
    `;
};
const App = (state) => {
    const { rovers } = state;
    const allAreNull = Object.values(rovers).reduce((accumulator, currentVal) => {
        if (currentVal !== null) {
            accumulator = false;
        }
        return accumulator;
    }, true);
    console.log(allAreNull);
    // Check for null data
    if (allAreNull) {
        return;
    }
    else {
        return `
            <section>
                ${buildInfoTag(state)}
                ${buildImgTag(state)}
            </section>
        `;
    }
    // // Destructure to get latest_photos as photo alias
    // const {
    // 	rovers: {
    // 		[state.active]: { latest_photos: photos },
    // 	},
    // } = state;
    // return `
    //     <section>
    //         ${buildRoverInfoTag(photos)}
    //         ${buildImgTag(photos)}
    //     </section>
    // `;
};
// Listeners
window.addEventListener("load", () => {
    // render(root, store)
});
rovers.addEventListener("click", cb);
// ------------------------------------------------------  COMPONENTS
// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `;
    }
    return `
        <h1>Hello!</h1>
    `;
};
// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date();
    const photodate = new Date(apod.date);
    console.log(photodate.getDate(), today.getDate());
    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store);
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
    }
    else {
        return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
    }
};
