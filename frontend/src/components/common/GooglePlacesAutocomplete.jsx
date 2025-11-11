import React, { useRef, useEffect, useState } from 'react';

const GooglePlacesAutocomplete = ({ value, onChange, onPlaceSelected, label, placeholder = 'Start typing address...', error, apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY }) => {
  const containerRef = useRef(null);
  const autocompleteElementRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.google?.maps?.importLibrary) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.importLibrary) {
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      const checkReady = setInterval(() => {
        if (window.google?.maps?.importLibrary) {
          setIsLoaded(true);
          clearInterval(checkReady);
        }
      }, 100);
    };
    
    script.onerror = () => console.error('Failed to load Google Maps API');
    document.head.appendChild(script);
  }, [apiKey]);

  const extractAddressComponents = (addressComponents) => {
    const result = { city: '', state: '', country: '', pinCode: '' };
    
    if (!addressComponents) return result;

    for (const component of addressComponents) {
      const types = component.types;
      if (types.includes('locality')) result.city = component.longText;
      if (types.includes('administrative_area_level_1')) result.state = component.longText;
      if (types.includes('country')) result.country = component.longText;
      if (types.includes('postal_code')) result.pinCode = component.longText;
      if (types.includes('postal_code_suffix')) result.pinCode = `${result.pinCode}-${component.longText}`;
    }

    return result;
  };

  const buildLocationData = (place, lat, lng, address) => {
    const { city, state, country, pinCode } = extractAddressComponents(place.addressComponents);
    
    const locationData = {
      address,
      city,
      state,
      country,
      latitude: lat,
      longitude: lng,
      pin_code: pinCode,
      coordinates: { type: 'Point', coordinates: [lng, lat] }
    };

    return locationData;
  };

  const handlePlaceSelect = async (event) => {
    try {
      const place = event.placePrediction.toPlace();
      await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'addressComponents'] });

      const lat = place.location.lat();
      const lng = place.location.lng();
      const address = place.formattedAddress;
      const locationData = buildLocationData(place, lat, lng, address);

      if (onPlaceSelected) onPlaceSelected(locationData);
      if (onChange) onChange({ target: { name: 'address', value: address } });
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const setupAutocompleteElement = (autocomplete) => {
    autocomplete.style.width = '100%';
    autocomplete.style.fontSize = '16px';
    
    if (placeholder) {
      setTimeout(() => {
        const inputElement = autocomplete.querySelector('input');
        if (inputElement) inputElement.placeholder = placeholder;
      }, 0);
    }
    
    autocompleteElementRef.current = autocomplete;
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(autocomplete);
    autocomplete.addEventListener('gmp-select', handlePlaceSelect);
  };

  const initPlaceAutocomplete = async () => {
    try {
      const { PlaceAutocompleteElement } = await window.google.maps.importLibrary('places');
      const autocomplete = new PlaceAutocompleteElement({ componentRestrictions: { country: 'in' } });
      setupAutocompleteElement(autocomplete);
    } catch (error) {
      console.error('Error loading Places library:', error);
    }
  };

  useEffect(() => {
    if (!isLoaded || !containerRef.current || autocompleteElementRef.current) return;
    initPlaceAutocomplete();
  }, [isLoaded, onPlaceSelected, onChange, placeholder]);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div 
        ref={containerRef}
        className={`w-full border rounded-lg transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        style={{ minHeight: '48px' }}
      >
        {!isLoaded && (
          <div className="px-4 py-3 text-gray-500 text-sm">
            Loading Google Maps...
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <p className="text-xs text-gray-500">
        Start typing to see address suggestions
      </p>
    </div>
  );
};

export default GooglePlacesAutocomplete;
