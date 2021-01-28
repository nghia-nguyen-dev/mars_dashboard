const root = document.getElementById('root');
const rovers = document.querySelector('.rovers')

// global state
const store = Immutable.Map({
    rovers: {},
})


const getRover = (rover: string) => {
	const options = {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({rover}),	// Body data type must match "Content-Type" header
    };
    
    fetch(`http://localhost:3000/rover`, options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            updateStore(store, {
                [rover]: data
            })
        })

        .catch(err => console.log(err))
    
}

const cb = (e) => {
    const roverName = e.target.dataset.rover;
    getRover(roverName)
}

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    // render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const App = (state) => {
    let { rovers, apod } = state

    return `
        <main>
            <section>
              
            </section>
        </main>
    `
}

// Listeners
window.addEventListener('load', () => {
    render(root, store)
})

rovers.addEventListener('click', cb)

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = async () => {

    fetch(`http://localhost:3000/rover`)
        .then(res => res.json())
        .then(apod => {
            console.log(apod);
            updateStore(store, apod)
        })

}

