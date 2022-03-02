const dbConfig = {
    // connectionType: "offline", // online or offline 

    sessionDb: "ams_sessions",

    offline: {
        hostname: "127.0.0.1",
        port: 27017,
        dbname: "afrilogic_messaging_service",
        username: "",
        password: ""
    },
    
    online: {
        hostname: "127.0.0.1",
        dbname: "cawms",
        username: "owiredu",
        password: "%24psword%3Dcawms"
    }
}

module.exports = dbConfig;