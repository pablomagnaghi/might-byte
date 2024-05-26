# might-byte
URL Shortener

# run server
docker-compose up -d

# test
1. POST to create shortened url
````
curl 'http://localhost:3000/url' \
--header 'Content-Type: application/json' \
--data '{
    "url": "classcalc.com"
}
````
2. You should receive a response like this
````
{
    "success": true
}
````
3. Go to http://localhost:15673/ (user: guest, pass: guest)
4. Select queues => shortenedURL
5. Go to Get messages and copy the shortenedURL
6. GET to obtain url
````
curl 'http://localhost:3000/64Oyrhc9lw'
````