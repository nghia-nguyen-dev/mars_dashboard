const root = document.getElementById("root");
const rovers = document.querySelector(".rovers");

// Interface
interface State {
    rovers: {
        curiosity: {
            latest_photos:{}[];
        };
        opportunity: {
            latest_photos:{}[];
        };
        spirit: {
            latest_photos:{}[];
        };
    };
    active: string;
}

interface Action {
    active?: string;
    type: string;
    roverInfo?: {
        latest_photos: {}[];
    };
}

// global state
const store:State = Immutable.fromJS({
	rovers: {
		curiosity: {},
		opportunity: {},
		spirit: {},
	},
	active: ``,
});

const fetchData = (state: State): void => {
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
			render(updateStore(state, { roverInfo: data, type: `SET_ROVER` }));
		})
		.catch((err) => console.log(err));
};

const main = (e):void => {
	const roverName = e.target.dataset.rover;
	const state = updateStore(store, { active: roverName, type: `SET_ACTIVE` });

	fetchData(state);
};

const updateStore = (state: State, action: Action): State => {

	// Both set() + setIn() returns a new MAP object
    if (action.type === `SET_ACTIVE`) {
        return state.set(`active`, Immutable.fromJS(action.active));
    } else if (action.type === `SET_ROVER`) {
        console.log(action.roverInfo);
        return state.setIn([`rovers`, `${state.get(`active`)}`], Immutable.fromJS(action.roverInfo));
    } else {
        return state;
    }
};

const render = (state: State):void => {
	root.innerHTML = App(state);
};

const buildImgTag = (state: State): string => {
	state = state.toJS();
	// Destructuring to pull out latest_photos array
	const {
		rovers: {
			[state.active]: { latest_photos },
		},
    } = state;

	return latest_photos.reduce((accumulator: string, currentPhoto: { img_src:string } ) => {
		return accumulator + `<img src="${currentPhoto.img_src}">`;
	}, ``); // initialize with empty string!!!
};

const buildInfoTag = (state: State) => {
    state = state.toJS();
    
	// Destructuring to pull out 1st item in the latest_photos array
	const {
		rovers: {
			[state.active]: {
				latest_photos: [roverInfo],
			},
		},
	} = state;

	return `
        <p>Status: <span class="status">${roverInfo.rover.status}</span</p>
        <p>Date of photos: ${roverInfo.earth_date}</p>
        <p>Launch date: ${roverInfo.rover.launch_date}</p>
        <p>Landing date: ${roverInfo.rover.landing_date}</p>
    `;

};

const App = (state: State) => {
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
window.addEventListener("load", ():void => {
	rovers.addEventListener("click", main);
});
