const corsOrigin = ctx => {
    if (process.env.CORS_ALLOWED_ORIGIN_LIST) {
      const validDomains = process.env.CORS_ALLOWED_ORIGIN_LIST.split(',');
        
      if (validDomains.includes(ctx.request.header.origin)) {
        return ctx.request.header.origin;
      }
      return validDomains[0];
    }
    return new URL(ctx.get('X-Forwarded-URI') || ctx.href).origin;
  };
  
  module.exports = {
    corsOrigin
  };