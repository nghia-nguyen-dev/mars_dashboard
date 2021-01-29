const root = document.getElementById("root");
const rovers = document.querySelector(".rovers");

// global state
let store = Immutable.fromJS({
	rovers: {},
	active: ``,
});

// Ts interface
interface Rover {
	landing_date: string;
	launch_date: string;
	status: string;
	photo_date: string;
	name: string;
}

interface Store {
	rovers: {};
	active: string;
}

const fetchData = (options):void => {
    fetch(`http://localhost:3000/rover`, options)
		.then((res) => res.json())
		.then((data) => {
			updateStore(store, {
				rovers: {
					[rover]: data,
				},
				// active: rover,
			});
		})
		.catch((err) => console.log(err));
}

const getRover = (rover: string):void => {

	const options = {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ rover }), // Body data type must match "Content-Type" header
	};

	fetchData(options);
};

const cb = (e) => {

	const roverName = e.target.dataset.rover;
	if (store.toJS().rovers[roverName]) {
		console.log(`already exist!`);
		render(root, store.toJS());
	} else {
		getRover(roverName);
	}
};

const updateStore = (prevState, newState) => {
	store = prevState.mergeDeep(newState);
	render(root, store.toJS());
};

const render = async (root, state) => {
	root.innerHTML = App(state);
};

const buildImgTag = (photos): string => {
	return photos.reduce((accumulator, currentPhoto) => {
		return accumulator + `<img src="${currentPhoto.img_src}">`;
	}, ``);
};

const buildRoverInfoTag = (rover: Rover): string => {
	return `
        <h2>${rover.name}</h2>
        <p>Status: ${rover.status}</p>
        <p>Date of photos: ${rover.photo_date}</p>
        <p>Launch date: ${rover.launch_date}</p>
        <p>Landing date: ${rover.landing_date}</p>
    `;
};

const App = (state: Store): string => {

    // Destructure to get latest_photos array
	const {
		rovers: {
			[state.active]: { latest_photos: photos },
		},
	} = state;
    // Build out rover info
	const roverInfo: Rover = {
		landing_date: photos[0].rover.landing_date,
		launch_date: photos[0].rover.launch_date,
		status: photos[0].rover.status,
		photo_date: photos[0].earth_date,
		name: photos[0].rover.name,
	};

	return `
        <section>
            ${buildRoverInfoTag(roverInfo)}
            ${buildImgTag(photos)}
        </section>
    `;

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

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = async () => {
	fetch(`http://localhost:3000/rover`)
		.then((res) => res.json())
		.then((apod) => {
			console.log(apod);
			updateStore(store, apod);
		});
};
