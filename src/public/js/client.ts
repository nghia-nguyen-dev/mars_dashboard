const root = document.getElementById("root");
const rovers = document.querySelector(".rovers");

// global state
const store:Store = Immutable.fromJS({
	rovers: {
        curiosity: null,
        opportunity: null,
        spirit: null,
    },
	active: null,
});

// INTERFACE
interface Rover {
	landing_date: string;
	launch_date: string;
	status: string;
	photo_date: string;
	name: string;
}

interface Store {
	rovers: {
        curiosity: null | { latest_photos: []};
        opportunity: null | { latest_photos: []};
        spirit: null | { latest_photos: []};
    };
	active: null | string;
}

const fetchData = (state:Store):void => {

	const options = {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(state), // Body data type must match "Content-Type" header
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

const cb = (e):void => {

    const roverName:string = e.target.dataset.rover;
    const currentState = updateStore(store, { active: roverName })

    // Check if rover info already exist to avoid unecessary fetching
	if (currentState.rovers[roverName] !== null) {
		render(currentState);
	} else {
		fetchData(currentState);
    }
};

const updateStore = (prevState:Store, newState:Store) => {
    prevState = Immutable.fromJS(prevState) // convert back to Immutable
	const currentState = prevState.mergeDeep(newState).toJS(); // convert back to raw JS objects after merge
    render(currentState);
    
    return currentState; 
};

const render = async (state:Store) => {
	root.innerHTML = App(state);
};

const buildImgTag = (state: Store): string => {
    // Destructuring to pull out latest_photos array
    const {
        rovers: {
            [state.active]: {
                latest_photos: photos
            }
        }
    } = state;


	return photos.reduce((accumulator, currentPhoto) => {
		return accumulator + `<img src="${currentPhoto.img_src}">`;
    }, ``); // initialize with empty string!!!
    
};

const buildInfoTag = (state: Store): string => {
    // Destructuring to pull out 1st item in the latest_photos array
    const {
        rovers: {
            [state.active]: {
                latest_photos: [
                    roverInfo
                ]
            }
        }
    } = state;
    
	return `
        <h2>${state.active}</h2>
        <p>Status: ${roverInfo.rover.status}</p>
        <p>Date of photos: ${roverInfo.earth_date}</p>
        <p>Launch date: ${roverInfo.rover.launch_date}</p>
        <p>Landing date: ${roverInfo.rover.landing_date}</p>
    `;
};

const App = (state:Store):string | undefined => {
    const { rovers } = state;

    const allAreNull = Object.values(rovers).reduce((accumulator, currentVal) => {
        if (currentVal !== null) {
            accumulator = false;
        }
        return accumulator
    }, true)

    // Check for null data
    if (allAreNull) {
        return;
    } else {
        return `
            <section>
                ${buildInfoTag(state)}
                ${buildImgTag(state)}
            </section>
        `;
    }

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
	} else {
		return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
	}
};