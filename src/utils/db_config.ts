const dbConfig = {
    sessionDb: "ams_sessions",

    offline: {
        hostname: "127.0.0.1",
        port: 27017,
        dbname: "ams",
        username: "",
        password: ""
    },
    
    online: {
        hostname: "cawcmms-heroku.mp6e3.mongodb.net",
        dbname: "ams",
        username: "cawcmms",
        password: "JAmUZnecM9GnnMD"
    }
}

export default dbConfig;