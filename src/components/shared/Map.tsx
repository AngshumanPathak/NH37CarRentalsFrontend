import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


const containerStyle = { width: "100%", height: "400px" };
const center = { lat: 26.1078715, lng: 91.8035368 };

export const Map = () => {

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
    console.log(googleMapsApiKey);

    const openGoogleMaps = () => {
        const destinationUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;
        window.open(destinationUrl, "_blank");
    };

     
    
    return (
        <>
        <div className="flex flex-col items-center gap-4 ">
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
        <button 
                onClick={openGoogleMaps} 
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600"
            >
                Get Directions
        </button>
        </div>
        
        </>
    )
}