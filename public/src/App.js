import { useState, useEffect, useRef } from 'react';
import Map, {Marker,Popup,FullscreenControl} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Star} from '@mui/icons-material/';
import "./App.css"
import axios from 'axios'
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const locStorage = window.localStorage;
  const [currentUser,setCurrentUser]  = useState(null);
  const [pins,setPins] = useState([]);
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [description,setDescription] = useState(null);
  const [rating,setRating] = useState(0);
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);


  const [viewState, setViewState] = useState({
    longitude: -10,
    latitude: 35,
    zoom: 2
  });
  const mapRef = useRef();

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins")
        setPins(res.data);
      }
      catch(err){
        console.log(err);
      }
    }
    getPins();
  }, [])
  
  const handleMarkerClick = (id,lat,long) =>{
    setCurrentPlaceId(id);
    mapRef.current?.flyTo({center: [long, lat], duration: 2000});
  }

  const handleAddClick = (e) =>{
   const loc = e.lngLat;
   const latitude = loc['lat']
   const longitude = loc['lng']
   setNewPlace({
    lat:latitude,
    long:longitude,
   })
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const newPin = {
      username:currentUser,
      title,
      description,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    }
    try{
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data])
      setNewPlace(null);
    }catch (err){
    }
  }

  const handleLogout = () => {
    locStorage.removeItem('user');
    setCurrentUser(null);
  }

  return (
    
    <Map
      {...viewState}
      ref={mapRef}
      onMove={evt => setViewState(evt.viewState)}
      onDblClick = {handleAddClick}
      style={{width: '100vw', height: '100vh'}}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      mapboxAccessToken={process.env.REACT_APP_MAPBOXURL}
    >
      <FullscreenControl />
      {pins.map(p => (
<>
        <Marker
          latitude={p.lat}
          longitude={p.long}
          anchor = 'center'
          onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
          color = {p.username === currentUser ? "tomato" : "slateblue"}
        >
        </Marker>

        {p._id === currentPlaceId && (
          <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton = {true}
          closeOnClick = {false}
          anchor = "top"
          onClose={()=>setCurrentPlaceId(null)}
        >
          <div className='card'>
            <h4 className='place'>{p.title}</h4>
            <label className='titles'> Review</label>
            <p className='desc'>{p.description}</p>
            <label className='titles'> Rating</label> 
            <div className='stars'>
              {Array(p.rating).fill( <Star className='star'/>)}
            </div>
            <span className='date'>Date:</span>
            <span className='username'>Created By <strong>{p.username}</strong></span>
          </div>
        </Popup>
        )}
</>
      ))}

      {newPlace && (
      <>
      <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton = {true}
          closeOnClick = {false}
          anchor = "top"
          onClose={()=>setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label className='titles'>Title</label>
              <input placeholder='Enter A Title' onChange={(e)=>setTitle(e.target.value)}/>
              <label className='titles'>Review</label>
              <textarea placeholder='How did this place make you feel?' onChange={(e)=>setDescription(e.target.value)}/>
              <label className='titles'>Rating</label>
              <select onChange={(e)=>setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <button className='submit' type='submit'>Add Pin</button>
              

            </form>
          </div>
        </Popup>
        </>
      )}
      {currentUser ? (<button className='btn-logout' onClick={handleLogout}> Log Out</button>) : (
        <div className='buttons'>
        <button className='btn-login' onClick={()=> {
          setShowLogin(true);
          setShowRegister(false);
          }}>Login</button>
        <button className = 'btn-register' onClick={()=>{
          setShowRegister(true);
          setShowLogin(false);
          }}>Register</button>
    </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} setShowLogin={setShowLogin} locStorage={locStorage} setCurrentUser={setCurrentUser}/>}
      {showLogin && <Login setShowLogin={setShowLogin} setShowRegister={setShowRegister} locStorage={locStorage} setCurrentUser={setCurrentUser}/>}
    </Map> 
  );
}


export default App;