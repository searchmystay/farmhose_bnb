import React, { useRef, useEffect, useState } from 'react';

const GooglePlacesAutocomplete = ({ value, onChange, onPlaceSelected, onInputChange, label, placeholder = 'Start typing address...', error, apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY }) => {
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
      if (types.includes('postal_code_suffix') && result.pinCode) {
        result.pinCode = `${result.pinCode}-${component.longText}`;
      }
      if (!result.city && types.includes('sublocality_level_1')) result.city = component.longText;
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

  // Inject CSS to override Google's styles globally
  const injectOverrideCSS = () => {
    const existingStyle = document.getElementById('google-autocomplete-override');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'google-autocomplete-override';
      style.textContent = `
        /* Override Google Places Autocomplete text color */
        gmp-place-autocomplete input,
        gmp-place-autocomplete input[type="text"],
        .gm-style input,
        .pac-container input {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          background-color: #ffffff !important;
          opacity: 1 !important;
          caret-color: #000000 !important;
        }
        
        /* Target shadow DOM elements */
        gmp-place-autocomplete::part(input) {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          background-color: #ffffff !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const applyCustomStyles = (autocomplete) => {
    // Inject CSS override first
    injectOverrideCSS();
    
    autocomplete.style.width = '100%';
    autocomplete.style.fontSize = '16px';
    autocomplete.style.backgroundColor = '#ffffff';
    autocomplete.style.borderRadius = '12px';
    autocomplete.style.border = '1px solid #d1d5db';
    autocomplete.style.boxShadow = 'none';
    autocomplete.style.padding = '0';

    // Function to aggressively apply input styles
    const forceInputStyles = (inputElement) => {
      if (inputElement) {
        console.log('Forcing input styles...');
        // Remove any existing style attributes that might conflict
        inputElement.style.cssText = '';
        
        // Apply all necessary styles
        const styles = {
          'background-color': '#ffffff',
          'color': '#000000',
          'font-size': '16px',
          'padding': '12px 16px',
          'border-radius': '12px',
          'border': 'none',
          'box-shadow': 'none',
          '-webkit-text-fill-color': '#000000',
          'caret-color': '#000000',
          'opacity': '1'
        };
        
        Object.entries(styles).forEach(([property, value]) => {
          inputElement.style.setProperty(property, value, 'important');
        });
      }
    };

    // Use MutationObserver to catch any changes Google makes
    const observeAndStyle = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            const inputElement = autocomplete.shadowRoot?.querySelector('input') || 
                               autocomplete.querySelector('input');
            if (inputElement) {
              forceInputStyles(inputElement);
            }
          }
        });
      });

      // Observe the autocomplete element and its shadow DOM
      if (autocomplete.shadowRoot) {
        observer.observe(autocomplete.shadowRoot, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
      }
      observer.observe(autocomplete, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      return observer;
    };

    // Apply styles with multiple strategies
    const applyWithRetries = (retryCount = 0) => {
      const maxRetries = 20;
      const inputElement = autocomplete.shadowRoot?.querySelector('input') || 
                         autocomplete.querySelector('input');
      
      if (inputElement) {
        forceInputStyles(inputElement);
        
        // Add event listeners to re-apply styles
        ['focus', 'input', 'change', 'keyup', 'keydown'].forEach(event => {
          inputElement.addEventListener(event, () => {
            setTimeout(() => forceInputStyles(inputElement), 0);
          });
        });
        
        // Start observing for changes
        observeAndStyle();
      } else if (retryCount < maxRetries) {
        setTimeout(() => applyWithRetries(retryCount + 1), 200);
      }
    };

    // Apply styles immediately and with intervals
    applyWithRetries();
    setTimeout(() => applyWithRetries(), 500);
    setTimeout(() => applyWithRetries(), 1000);
    
    const trailingIcon = autocomplete.shadowRoot?.querySelector('button');
    if (trailingIcon) {
      trailingIcon.style.paddingRight = '12px';
    }
  };

  const setupAutocompleteElement = (autocomplete) => {
    applyCustomStyles(autocomplete);
    
    if (placeholder) {
      setTimeout(() => {
        const inputElement = autocomplete.shadowRoot?.querySelector('input') || autocomplete.querySelector('input');
        if (inputElement) {
          inputElement.placeholder = placeholder;
          // Ensure text color is set even when setting placeholder
          inputElement.style.setProperty('color', '#000000', 'important');
          inputElement.style.setProperty('-webkit-text-fill-color', '#000000', 'important');
        }
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
  }, [isLoaded, onPlaceSelected, onChange, onInputChange, placeholder]);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div 
        ref={containerRef}
        className={`w-full rounded-lg transition-all ${
          error ? 'border border-red-500' : ''
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
