export const ErrorMiddleware = (err, req, res, next) => {
    if(req.body === undefined || req.body === null || Object.keys(req.body).length === 0){
        return res.status(400).json({ error: 'Missing body.' });
    }


    const status = err.status || 500;
    let message = err.message || 'Unexpected Error.';

    if(status === 500){
        console.error(err);
        message = 'Internal Server Error.';
    }

    return res.status(status).json({ error: message });
}