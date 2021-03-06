import { ServicesActions, ServicesActionTypes } from './services.actions';
import { Service, Endpoint } from '../../shared/service.interface';

export interface ServicesState {
  services: Service[];
  selectedEndpoint: any | undefined;
  isImportingProject: boolean;
  isLoadingServices: boolean;
  error: string;
  config: {}
}

export const initialState: ServicesState = {
  services: [],
  config: {},
  selectedEndpoint: undefined,
  isImportingProject: false,
  isLoadingServices: false,
  error: '',
};

export function reducer(state = initialState, action: ServicesActions): ServicesState {
  switch (action.type) {
    case ServicesActionTypes.LOAD_SERVICES:
      return {
        ...state,
        isLoadingServices: true,
      };
    case ServicesActionTypes.LOAD_SERVICES_SUCCESS:
      return {
        ...state,
        services: [...action.payload.services],
        config: action.payload.config,
        isLoadingServices: false,
        error: '',
      };
    case ServicesActionTypes.UPDATE_PROJECT_CONFIG:
      return {
        ...state,
        config: action.payload.data
      }
    case ServicesActionTypes.LOAD_SERVICES_FAILURE:
      return {
        ...state,
        services: [],
        isLoadingServices: false,
        error: action.payload,
      };
    case ServicesActionTypes.DELETE_SERVICE_SUCCESS:
      return {
        ...state,
        services: state.services.filter(service => service.serviceName !== action.payload),
        selectedEndpoint: (state.selectedEndpoint) && state.selectedEndpoint.serviceName === action.payload ? null : state.selectedEndpoint,
        error: '',
      };
    case ServicesActionTypes.DELETE_ENDPOINT_SUCCESS:
      return {
        ...state,
        services: state.services.map(service => {
          service.endpoints = service.endpoints.filter((endpoint) => endpoint.id !== action.payload);
          return service;
        }).filter((service) => service.endpoints.length !== 0),
        selectedEndpoint: (state.selectedEndpoint) && state.selectedEndpoint._id === action.payload ? null : state.selectedEndpoint,
        error: '',
      };
    case ServicesActionTypes.DELETE_SERVICE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case ServicesActionTypes.LOAD_SELECTED_ENDPOINT_SUCCESS:
      return {
        ...state,
        selectedEndpoint: action.payload,
        error: '',
      };
    case ServicesActionTypes.LOAD_SELECTED_ENDPOINT_FAILURE:
      return {
        ...state,
        services: [],
        error: action.payload,
      };
    case ServicesActionTypes.IMPORT_PROJECT:
      return {
        ...state,
        isImportingProject: true,
      };
    case ServicesActionTypes.IMPORT_PROJECT_SUCCESS:
      return {
        ...state,
        services: action.payload,
        selectedEndpoint: null,
        isImportingProject: false,
        error: '',
      };
    case ServicesActionTypes.IMPORT_PROJECT_FAILURE:
      return {
        ...state,
        isImportingProject: false,
      };
    default:
      return state;
  }
}
