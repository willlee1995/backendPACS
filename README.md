## PacsMan

### Backend

For backend code only

```backendPACS
backendPACS                       
├─ src                            
│  ├─ apis                        
│  │  ├─ tasks.js                 
│  │  └─ users.js                 
│  ├─ constants                   
│  │  └─ index.js                 
│  ├─ functions                   
│  │  └─ slug-generator.js        
│  ├─ middlewares                 
│  │  ├─ auth-guard.js            
│  │  ├─ passport-middleware.js   
│  │  ├─ uploader.js              
│  │  └─ validator-middleware.js  
│  ├─ models                      
│  │  ├─ index.js                 
│  │  ├─ Task.js                  
│  │  └─ User.js                  
│  ├─ uploads                     
│  ├─ validators                  
│  │  ├─ index.js                 
│  │  ├─ task-validators.js       
│  │  └─ user-validator.js        
│  └─ index.js                    
├─ index.js                       
├─ package-lock.json              
├─ package.json                   
├─ Procfile                       
└─ README.md                      
```

## Installation guide

requirement: node.js>14.0

For the first time, please  npm i / yarn install for installing dependencies in the terminal

npm run dev - to kickstart the local development environment with connection to the deployed database

### jwt authentication

http://www.passportjs.org/packages/passport-jwt/

### express based

https://expressjs.com/zh-tw/

### httpOnly Cookie for authenication of user

https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies

### MongoDB with mongoose

https://www.mongodb.com/

### RESTful API

https://restfulapi.net/

### Helper function for slug generation for better access  

```
---
