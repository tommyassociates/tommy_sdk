const api = window.tommy.api;

const API = {
  cache: {
    services: [],
    coupons: [],
    locations: [],
    booking: {},
  },
  getServiceList(categoryId) {
    return api.call({
      endpoint: 'vendors/1/products',
      method: 'GET',
      data: {}
    }).then((data) => {
      API.cache.services = data;
      return data;
    });
  },
  getCouponList(categoryId) {
    return api.call({
      endpoint: 'vendors/1/coupons',
      method: 'GET',
      data: {}
    }).then((data) => {
      API.cache.coupons = data;
      return data;
    });
  },
  getLocations() {
    return api.call({
      endpoint: 'addons/nurse_booking/install/settings/locations',
      method: 'GET',
    }).then((res) => {
      API.cache.locations = res.data && res.data.locations ? res.data.locations : [];
      return API.cache.locations;
    });
  },
  saveLocations(locations) {
    if (!locations) {
      locations = API.cache.locations;
    } else {
      API.cache.locations = locations;
    }
    return api.call({
      endpoint: 'addons/nurse_booking/install/settings/locations',
      method: 'PUT',
      data: {data: JSON.stringify({locations})},
    }).then((res) => {
      return res.data.locations;
    });
  },
  addLocation(location) {
    if (location.default) {
      API.cache.locations.forEach((loc) => {
        loc.default = false;
      });
      API.cache.locations.unshift(location);
    } else {
      API.cache.locations.push(location);
    }
    return API.saveLocations(API.cache.locations);
  },
  removeLocation(index) {
    API.cache.locations.splice(index, 1);
    return API.saveLocations(API.cache.locations);
  }
}

export default API
