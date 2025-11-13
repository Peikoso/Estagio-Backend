export const ErrorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if(status === 500){
        console.error(err);
    }

    return res.status(status).json({ error: message });
}