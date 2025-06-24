export const corsOptions = (req, callback) => {
    const allowedUrl = ["http://localhost:3000"];
  
    let corsOpt;
  
    if (allowedUrl?.includes(req.header("Origin"))) {
      corsOpt = { origin: true };
    } else {
      corsOpt = { origin: false };
    }
  
    callback(null, corsOpt);
  };
  