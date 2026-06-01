import {
  trackPageView as apiTrackPageView,
  trackSearch as apiTrackSearch,
  trackProductView as apiTrackProductView,
  trackAdClick as apiTrackAdClick,
} from './api'

export function trackPageView(path, referrer = '') {
  apiTrackPageView(path, referrer).catch(() => {})
}

export function trackSearch(query, resultsCount = 0) {
  apiTrackSearch(query, resultsCount).catch(() => {})
}

export function trackProductView(id) {
  if (!id) return
  apiTrackProductView(id).catch(() => {})
}

export function trackAdClick(id) {
  if (!id) return
  apiTrackAdClick(id).catch(() => {})
}
