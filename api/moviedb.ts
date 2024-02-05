import axios from 'axios';
import { apiKey } from '../constants/index'

const apiBaseUrl = 'https://api.themoviedb.org/3'
const trendingMoviesEndPoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`
const upcomingMoviesEndPoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`
const topRatedMoviesEndPoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`
const detailsEndPoint = (id: number) => `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`
const creditsEndPoint = (id: number) => `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`
const similarEndPoint = (id: number) => `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`
const castDetailsEndPoint = (id: number) => `${apiBaseUrl}/person/${id}?api_key=${apiKey}`
const castMovieDetailsEndPoint = (id: number) => `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`
const SearchMoviesEndPoint = `${apiBaseUrl}/search/movie?api_key=${apiKey}`

export const image500 = (path: string) => path ? `https://image.tmdb.org/t/p/w500/${path}` : null
export const image342 = (path: string) => path ? `https://image.tmdb.org/t/p/w342/${path}` : null
export const image185 = (path: string) => path ? `https://image.tmdb.org/t/p/w185/${path}` : null

export const fallbackMoviePoster = 'https://img.myloview.com/stickers/white-laptop-screen-with-hd-video-technology-icon-isolated-on-grey-background-abstract-circle-random-dots-vector-illustration-400-176057922.jpg';
export const fallbackPersonImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUiF-YGjavA63_Au8jQj7zxnFxS_Ay9xc6pxleMqCxH92SzeNSjBTwZ0l61E4B3KTS7o&usqp=CAU';



const apiCall = async (endpoint: string, params?: undefined) => {

    const options = {
        method: 'GET',
        url: endpoint,
        params: params ? params : {}
    }
    try {
        const response = await axios.request(options)
        return response.data
    } catch (error) {
        console.log("error: ", error)
        return {}
    }

}

export const fetchTrendingMovies = () => {
    return apiCall(trendingMoviesEndPoint)
}
export const fetchUpcomingMovies = () => {
    return apiCall(upcomingMoviesEndPoint)
}
export const fetchTopRatedMovies = () => {
    return apiCall(topRatedMoviesEndPoint)
}
export const fetchDetails = (id: number) => {
    return apiCall(detailsEndPoint(id))
}
export const fetchCredits = (id: number) => {
    return apiCall(creditsEndPoint(id))
}
export const fetchSimilar = (id: number) => {
    return apiCall(similarEndPoint(id))
}
export const fetchCastDetails = (id: number) => {
    return apiCall(castDetailsEndPoint(id))
}
export const fetchCastMovieDetails = (id: number) => {
    return apiCall(castMovieDetailsEndPoint(id))
}
export const fetchSearchMovie = (params: any) => {
    return apiCall(SearchMoviesEndPoint, params)
}