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
        hostname: "127.0.0.1",
        dbname: "ams",
        username: "owiredu",
        password: "%24psword%3Dcawms"
    }
}

export default dbConfig;