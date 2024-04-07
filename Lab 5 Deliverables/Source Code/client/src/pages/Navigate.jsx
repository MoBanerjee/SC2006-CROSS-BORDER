//Navigate.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Navigate.css';
import { GoogleMap, LoadScript, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { toast } from 'react-toastify';
import logoImage from '../assets/landscapelogo.png'; 
import backImage from '../assets/back.png'; 
import {GOOGLE_MAPS_AK} from './API_KEYS.jsx'

/**
 * The MapWithRoute component is responsible for rendering a Google Map with the capability
 * to calculate and display a route based on user-specified start and end locations. It utilizes
 * Google Maps JavaScript API and Places API to offer autocomplete suggestions for locations and
 * render the calculated route.
 */
const MapWithRoute = () => {
  const [startLocation, setStartLocation] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [startLocText, setStartText] = useState("");
  const [destLocText, setDestText] = useState("");
  const [userIsTypingStart, setUserIsTypingStart] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    steps: [],
    duration: '',
    distance: '',
  });
  const defaultCenter = { lat: -34.397, lng: 150.644 };

  // Initial setup to set the map's origin point
  useEffect(() => {
    setOrigin(defaultCenter);
  }, []);

    /**
 * Handles selection of a place from the autocomplete suggestions. Updates location states and input text
 * states based on the selected place's geometry and name. Also, flags user typing state to false indicating
 * selection from suggestions.
 * 
 * @param {Function} updateFunction - State setter function to update location state (origin/destination).
 * @param {Function} setTextFunction - State setter function to update input text state.
 */
  const handlePlaceSelect = (updateFunction,setTextFunction) => (autocomplete) => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log('No details available for input: ' + place.name);
      return;
    }
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    updateFunction(location);
    setTextFunction(place.name);
    setUserIsTypingStart(false);
  };

const handleDestInput=(e)=>{
  console.log(e.target.value);
 
setDestText(e.target.value);
}

/**
 * Fetches directions from the Google Maps Directions service using the specified start and end locations.
 * On successful fetch, updates the directions state for rendering and processes the detailed trip information
 * including steps, duration, and distance for display.
 */
  const fetchDirections = (start, end) => {
    if (startLocText=="" || destLocText==""){
      toast.info("Please fill all input fields!");
      return;
    }

    if(start.lat==end.lat && start.long==end.long){
      toast.info("Start and End destination cannot be same!");
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: window.google.maps.TravelMode.TRANSIT,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const route = result.routes[0];
          const leg = route.legs[0];
          const steps = leg.steps.map(step => ({
            instruction: step.instructions,
            distance: step.distance.text,
            duration: step.duration.text,
          }));
          const duration = leg.duration.text;
          const distance = leg.distance.text;
          setTripDetails({
            steps,
            duration,
            distance,
          });
        } else {

          toast.info("No route could be found!");
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const handleSelectCurrentLocationStart = () => {
    setStartText("Your Current Address");
    setUserIsTypingStart(false); 
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      setOrigin(currentLocation);
      
    });
  };

  const handleInputChange = (e) => {
    setStartText(e.target.value);
    setUserIsTypingStart(true); 
  };


  const handleLoadStart = (autocomplete) => {
    autocomplete.addListener('place_changed', () => handlePlaceSelect(setOrigin, setStartText)(autocomplete));
  };

  const handleLoadDestination = (autocomplete) => {
    autocomplete.addListener('place_changed', () => handlePlaceSelect(setDestination,setDestText)(autocomplete));
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className='navigate-main'>
      <div className="header-container">
        <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
        <img src={logoImage} alt="Logo" className="logo-image"/>
        <div></div>
      </div>  
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_AK}
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={{ width: '500px', height: '300px'}}
          center={origin || defaultCenter}
          zoom={14}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      <div className="input-container">
        <Autocomplete onLoad={handleLoadStart} className='autocomplete'>
          <input
            type="text"
            placeholder="Enter start location"
            value={userIsTypingStart ? startLocText : (startLocText || '')}
            onChange={handleInputChange}
          />
        </Autocomplete>
        <button className="use-location-button" onClick={handleSelectCurrentLocationStart}>Use Current Location</button>
      </div>
      <div className="input-container">
        <Autocomplete onLoad={handleLoadDestination} className='autocomplete'>
          <input type="text" placeholder="Enter destination" onChange={handleDestInput} />
        </Autocomplete>
      </div>
      <div className="find-route-container">
        <button className="find-route-button" onClick={() => fetchDirections(startLocation || origin, destination)}>Find Route</button>
      </div>
      <div className="trip-details">
        <h3>Trip Details</h3>
        <p>Distance: {tripDetails.distance}</p>
        <p>Duration: {tripDetails.duration}</p>
        <ol>
          {tripDetails.steps.map((step, index) => (
            <li key={index}>
              {step.instruction} (Distance: {step.distance}, Duration: {step.duration})
            </li>
          ))}
        </ol>
      </div>
      </LoadScript>
    </div>
  );
};

export default MapWithRoute;