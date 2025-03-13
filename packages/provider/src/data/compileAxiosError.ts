import { AxiosError } from 'axios';

const compileAxiosError = (error: AxiosError) => {
    if (!error) {
        return ({
            success: false,
            message: 'Unbekannter Fehler',
            type: 'unknown-error'
        })
    }
    return ({
        success: false,
        message: error.message,
        type: 'network-error'
    })
  
}

export default compileAxiosError;
