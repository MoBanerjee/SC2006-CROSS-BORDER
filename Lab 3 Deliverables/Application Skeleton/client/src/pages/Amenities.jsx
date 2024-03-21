//Amenities.jsx
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useUser } from '../contexts/UserContext';
import "../styles/Amenities.css";
import { toast } from 'react-toastify';

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
        switch (userProfile.nationality) {
          case 'Indian':
            setNation("Indian");
            break;
          case 'Chinese':
            setNation("Chinese");
            break;
          case 'Malaysian':
            setNation("Malaysian");
            break;
          default:
            setNation("");
            break;
        }
      }
    }, [userProfile]);

     // Effect hook for initializing Google Maps script
    useEffect(() => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=""&libraries=places`;
      script.async = true;
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    }, []);
  
  /**
   * Initializes the Google Map centered on the user's current location.
   * It creates a new map instance and sets the map state, enabling further
   * map-related operations such as placing markers.
   */
    const initializeMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          setLocation(currentLocation);
          const map = new window.google.maps.Map(document.getElementById('map'), {
            center: currentLocation,
            zoom: 15,
          });
          setMap(map);
        });
      }
    };
  
      /**
   * Clears all existing markers from the map.
   * This function is typically called before displaying new search results to ensure
   * the map only shows relevant markers for the current search.
   */
    const clearMarkers = () => {
      markers.forEach(marker => marker.setMap(null)); 
      setMarkers([]); 
    };

  const sliderSettings = {
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    adaptiveHeight: true, 
    nextArrow: <SampleNextArrow />, 
    prevArrow: <SamplePrevArrow />, 
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "grey"}}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "grey", borderRadius: "50%" }}
        onClick={onClick}
      />
    );
  }

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
            title: place.name, 
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
                  : 'URL_TO_A_DEFAULT_IMAGE_IF_NEEDED';
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

  return (
    <div>
      <div className="sticky-controls">
      <div>
        {['restaurant', 'subway_station', 'bus_station', 'grocery_or_supermarket', "hospital"].map((type) => (
          <label key={type}>
            <input
              type="radio"
              name="amenityType"
              value={type}
              onChange={handleAmenityTypeChange}
            />{' '}
            {type === 'subway_station' ? 'MRT Station' : type === 'restaurant' ? nation+' Eateries' :type === 'bus_station' ? 'Bus Stop' : type === 'grocery_or_supermarket' ? nation+' Shops' : type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>
      </div>
      <button onClick={fetchAmenities}>FIND NEAREST AMENITIES</button>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
      <Slider {...sliderSettings}>
        {amenities.map((amenity, index) => (
          <div key={index} style={{margin: '20px', textAlign: 'center'}}>
            <img src={amenity.photoUrl} alt={`Thumbnail of ${amenity.name}`} style={{width: '100px', height: '100px', marginBottom: '10px'}} />
            <div>
              <strong>{amenity.name}</strong> - {amenity.vicinity}<br/>
              Rating: {amenity.rating}, Status: {amenity.openNow}<br/>
              {amenity.openingHours.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
              <ul style={{listStyle: 'none', padding: 0}}>
                {amenity.reviews.slice(0, 3).map((review, reviewIdx) => (
                  <li key={reviewIdx} style={{textAlign: 'left', margin: '10px 0'}}>
                    "{review.text}" - <strong>{review.author_name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NearbyAmenities;
