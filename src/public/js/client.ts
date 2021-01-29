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

const cb = (e) => {
 
    const roverName = e.target.dataset.rover;
    const currentState = updateStore(store, {active: roverName})

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

const buildImgTag = (photos): string => {
	return photos.reduce((accumulator, currentPhoto) => {
		return accumulator + `<img src="${currentPhoto.img_src}">`;
	}, ``); // initialize with empty string!
};

const buildRoverInfoTag = (photos): string => {
      // Build out rover info
	const rover: Rover = {
		landing_date: photos[0].rover.landing_date,
		launch_date: photos[0].rover.launch_date,
		status: photos[0].rover.status,
		photo_date: photos[0].earth_date,
		name: photos[0].rover.name,
    };
    
	return `
        <h2>${rover.name}</h2>
        <p>Status: ${rover.status}</p>
        <p>Date of photos: ${rover.photo_date}</p>
        <p>Launch date: ${rover.launch_date}</p>
        <p>Landing date: ${rover.landing_date}</p>
    `;
};

const App = (state:Store):string | undefined => {

    console.log(state);
    const { rovers } = state;

    const allNull = Object.values(rovers)
        .reduce((acc, current) => {
            if (current === null) {
                acc = true;
            } else {
                acc = false;
            }
            return acc;
        })

    console.log(allNull);

    // Check for null data
    if (allNull) {
        return;
    } else {
        return `
            <section>
                ${buildRoverInfoTag(state)}
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
	} else {
		return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
	}
};