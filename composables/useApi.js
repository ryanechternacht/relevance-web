import lodash_pkg from 'lodash';
const { camelCase, transform, isArray, isObject } = lodash_pkg;

const camelize = obj => transform(obj, (acc, value, key, target) => {
  const camelKey = isArray(target) ? key : camelCase(key);
  
  acc[camelKey] = isObject(value) ? camelize(value) : value;
});

export const useApi = (url, options) => {
  return useFetch(url, {
    ...options,
    transform: camelize,
    // By default, nuxt was trying to intelligently refresh requests,
    // which was causing api calls to be repeated without me realizing it.
    // this feels like i'm working againt the api somehow, but this approach
    // was recommended by the docs. Maybe I should just be manually setting
    // this on non-get routes? that seems off...
    watch: false,
    $fetch: useNuxtApp().$api
  })
}
