# C:\Users\davidp-silico\Documents\personel\Abrasia\Abrasia-Frontend\Dockerfile

# ---------- build ----------
    FROM node:22-alpine AS build
    WORKDIR /app
    
    # NPM
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # Code
    COPY . .
    
    # Param API “baked” pour Vite (utilisé au build)
    ARG VITE_BACKEND_URL=http://localhost:4242
    ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
    
    # Build Vite
    RUN npm run build
    
    # ---------- runtime ----------
    FROM nginx:1.27-alpine
    
    # conf SPA + cache
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    # Valide la conf Nginx au build (échoue si invalide)
    RUN nginx -t
    
    # fichiers statiques
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/ >/dev/null || exit 1
    