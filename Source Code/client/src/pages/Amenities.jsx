//Amenities.jsx
import React, { useState, useEffect,useCallback  } from 'react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useUser } from '../contexts/UserContext';
import "../styles/Amenities.css";
import { toast } from 'react-toastify';
import logoImage from '../assets/landscapelogo.png'; 
import backImage from '../assets/back.png'; 
import defaultAm from "../assets/defaultAmenities.png";
import {GOOGLE_MAPS_AK} from './API_KEYS.jsx'

// initializing Google Maps script
const loadGoogleMapsScript = (callback) => {
  const existingScript = document.getElementById('googleMapsScript');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_AK}&libraries=places`;
    script.id = 'googleMapsScript';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  } else if (callback) {
    callback();
  }
};

/**
 * Displays amenities near the user's current location, allowing them to choose from different types of amenities.
 * 
 * This component first retrieves the user's nationality from the context to tailor the amenities search (e.g., Indian Eateries)
 * based on the user's preferences. It then initializes a Google Map centered on the user's current location, fetched via
 * the Geolocation API. Users can select an amenity type to search for nearby places like restaurants, MRT stations, etc.
 * The search results are displayed both on the map with markers and below the map using a slider component, with details
 * about each amenity such as name, rating, and reviews.
 * 
 * Uses Google Maps JavaScript API for map and places services, `react-slick` for a responsive and accessible slider,
 * and `react-toastify` for notification messages.
 */
const NearbyAmenities = () => {
    const { userProfile } = useUser();
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [amenityType, setAmenityType] = useState('');
    const [amenities, setAmenities] = useState([]);
    const [map, setMap] = useState(null);
    const [nation,setNation]= useState("");
    const [markers, setMarkers] = useState([]);
  
     // Effect hook to update component based on user profile context
    useEffect(() => {
      if (userProfile && userProfile.nationality) {
          setNation(userProfile.nationality);
      }
  }, [userProfile]);

    /**
   * Initializes the Google Map centered on the user's current location.
   * It creates a new map instance and sets the map state, enabling further
   * map-related operations such as placing markers.
   */
  const initializeMap = useCallback(() => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
              const currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
              setLocation(currentLocation);
              const map = new window.google.maps.Map(document.getElementById('map'), {
                  center: currentLocation,
                  zoom: 15,
              });
              setMap(map);
          }, (error) => {
              console.error("Geolocation error:", error);
              toast.error('Geolocation error. Please enable location services.');
          });
      } else {
          toast.error('Geolocation is not supported by this browser.');
      }
  }, []);

  useEffect(() => {
      loadGoogleMapsScript(initializeMap);
  }, [initializeMap]);
  
        /**
   * Clears all existing markers from the map.
   * This function is typically called before displaying new search results to ensure
   * the map only shows relevant markers for the current search.
   */
    const clearMarkers = () => {
      markers.forEach(marker => marker.setMap(null)); 
      setMarkers([]); 
    };

    /**
 * Fetches nearby amenities based on the selected amenity type and user's location.
 * Utilizes the Google Places API to find amenities and updates the map and amenities
 * state with the search results. It also clears any existing markers before displaying
 * new ones.
 */
  const fetchAmenities = () => {
    if (!map) return;

    if (!amenityType) {
        toast.info("Please select an amenity type before searching.");
        return;
    }

    clearMarkers(); 

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: location,
      radius: '500',
      type: [amenityType],
    };

    if (amenityType === 'restaurant' || amenityType === "grocery_or_supermarket") {
      request.keyword = nation;
    }

    service.nearbySearch(request, async (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const newMarkers = results.map(place => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name, // Set the marker's title to the place name
          });
         
        const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div>
                <h3>${place.name}</h3>
                <p>${place.vicinity}</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.vicinity)}" target="_blank">View on Google Maps</a>
              </div>
            `
          });
  
          marker.addListener('click', () => {
          
            if (window.currentInfoWindow) {
              window.currentInfoWindow.close();
            }
          
            window.currentInfoWindow = infoWindow;
            infoWindow.open({
              anchor: marker,
              map,
              shouldFocus: false,
            });
          });
  
          return marker;
        });

        setMarkers(newMarkers);
        const placesDetailsPromises = results.slice(0, 5).map(place =>
          new Promise((resolve) => {
            service.getDetails({placeId: place.place_id}, (detail, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const photoUrl = detail.photos && detail.photos.length > 0
                  ? detail.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
                  : defaultAm;
                const openingHours = detail.opening_hours ? detail.opening_hours.weekday_text : ['Opening hours not available'];
                resolve({...detail, photoUrl, openingHours});
              } else {
                resolve(null);
              }
            });
          })
        );

        const placesDetails = await Promise.all(placesDetailsPromises);
        const detailedAmenities = placesDetails.filter(detail => detail !== null).map(detail => ({
          name: detail.name,
          vicinity: detail.vicinity,
          rating: detail.rating || 'Rating not available',
          openNow: detail.opening_hours ? (detail.opening_hours.open_now ? 'Open' : 'Closed') : 'Opening hours not available',
          reviews: detail.reviews || [],
          photoUrl: detail.photoUrl,
          openingHours: detail.openingHours,
        }));

        setAmenities(detailedAmenities);
      }
      else if (results.length===0 || amenities.length === 0) {
        
        toast.info('No amenities found!');
      }
      else if (status !== window.google.maps.places.PlacesServiceStatus.OK || results.length === 0) {
        
        toast.error('Failed to find amenities or no amenities available for the selected type.');
      }
    });
  };

    /**
 * Updates the amenityType state based on user selection.
 * This function is triggered by user interaction with the amenity type selection
 * controls, allowing the user to change the type of amenities they wish to search for.
 */
  const handleAmenityTypeChange = (e) => {
    setAmenityType(e.target.value);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="amenities-main">
      <div className="header-container">
        <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
        <img src={logoImage} alt="Logo" className="logo-image"/>
        <div></div>
      </div>
  
      <div className="sticky-controls">
        {['restaurant', 'subway_station', 'bus_station', 'grocery_or_supermarket', "hospital"].map((type) => (
          <label key={type}>
            <input
              type="radio"
              name="amenityType"
              value={type}
              onChange={handleAmenityTypeChange}
            />{' '}
            {type === 'subway_station' ? 'MRT Station' : type === 'restaurant' ? nation+' Eateries' : type === 'bus_station' ? 'Bus Stop' : type === 'grocery_or_supermarket' ? nation+' Shops' : type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>
      <button onClick={fetchAmenities}>Find Nearest Amenities</button>
      <div id="map" style={{ height: '50%', width: '80%', maxHeight: '300px'}}></div>
  
      {/* Simple list to display amenities */}

      <div className="amenities-list">
        {amenities.map((amenity, index) => (
        <div key={index} className="amenity-item">
          <div className="amenity-main">
            <img src={amenity.photoUrl} alt={`Thumbnail of ${amenity.name}`} />
            <div className="amenity-info">
              <p><strong>{amenity.name}</strong></p>
              <p>{amenity.vicinity}</p>
              <p>Rating: {amenity.rating}, Status: {amenity.openNow}</p>
              <div className="opening-hours">
                {amenity.openingHours.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          </div>
          <ul className="amenity-reviews">
            {amenity.reviews.slice(0, 3).map((review, reviewIdx) => (
              <li key={reviewIdx}>
                "{review.text}" - <strong>{review.author_name}</strong>
              </li>
            ))}
          </ul>
        </div>
  ))}
</div>

    </div>
  );
};

export default NearbyAmenities;

