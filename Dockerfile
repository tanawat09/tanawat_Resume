# Use the official Nginx image as the base image
FROM nginx:alpine

# Ensure Thai text is served as UTF-8, even for clients that do not inspect the HTML meta tag.
RUN printf 'server {\n    listen 80;\n    server_name localhost;\n    root /usr/share/nginx/html;\n    index index.html;\n    charset utf-8;\n\n    location / {\n        try_files $uri $uri/ =404;\n    }\n}\n' > /etc/nginx/conf.d/default.conf

# Copy the static website files to the Nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
