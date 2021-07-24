import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import Star from '@material-ui/icons/Star';
import axios from 'axios';
import { format } from "timeago.js";
import Login from  "./components/Login"

import "./app.css";
import Register from './components/Register';


function App() {
  const myStorage  = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setStar] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 4,

  });
  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handlerDoubleClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long
    })
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }

    try {
      const res = await axios.post("/pins", newPin)
      setPins([...pins, res.data]);
      setNewPlace(null);

    }
    catch (err) {
      console.log(err);
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/viswas/ckrd3maws0f1817o290p843l0"
        transitionDuration="200"
        onDblClick={handlerDoubleClick}
      >
        {pins.map(p => (
          <>
            <Marker latitude={p.lat} longitude={p.long} offsetLeft={-3.5 * viewport.zoom} offsetTop={-7 * viewport.zoom}>
              <RoomIcon style={{ fontSize: viewport.zoom * 7, color: (p.username === currentUser) ? "red" : "grey", cursor: "pointer" }} onClick={() =>
                handleMarkerClick(p._id, p.lat, p.long)}> </RoomIcon>
            </Marker>
            {p._id === currentPlaceId && (
              < Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left" >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc} </p>
                  <label>Rating</label>
                  <div className="star">

                    {Array(p.rating).fill(<Star className="star" />)}

                  </div>
                  <label>Information</label>
                  <span className="username">{p.username}</span>
                  <span className="date"> {format(p.createdAt)}</span>
                </div>

              </Popup>
            )}

          </>
        ))}
        {newPlace && (
          < Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left" >

            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setStar(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>




          </Popup>
        )};
       {currentUser ? (<button className=" button logout" onClick = {handleLogout}>Logout </button>): (<div className="buttons">
          <button className="button login" onClick = {() => setShowLogin(true)}>Log In</button>
          <button className=" button register" onClick = {()=> setShowRegister(true)}>Register</button>
        </div>) }
        
        {showRegister && (<Register setShowRegister = {setShowRegister}/>)}
        {showLogin && (<Login  setShowLogin = {setShowLogin} myStorage = {myStorage} setCurrentUser = {setCurrentUser}/>)}
      </ReactMapGL>

    </div >
  );
}

export default App;
