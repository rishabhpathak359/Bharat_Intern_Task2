
const fs = require('fs');
const http = require('http');
const requests = require('requests');

const mainFile = fs.readFileSync("home.html", "utf-8");
let replaceVal = (mainFile, newData) => {
  if(newData.cod==404){
    mainFile=`<h1>404: ${newData.message}</h1>`
}
else if(newData.cod==400){
  mainFile=`<h1>400: ${newData.message}</h1>`
}
else{
  mainFile = mainFile.replace("{%tem%}", newData.main.temp );
  mainFile = mainFile.replace("{%humidity%}", newData.main.humidity);
  mainFile = mainFile.replace("{%wind%}", newData.wind.speed);
  mainFile = mainFile.replace("{%visibility%}", (newData.visibility)/1000);
  mainFile = mainFile.replace("{%press%}", newData.main.pressure );
  mainFile = mainFile.replace("{%description%}", newData.weather[0].main );
  mainFile = mainFile.replace("{%city%}", newData.name);
  mainFile = mainFile.replace("{%rise%}", ((new Date((newData.sys.sunrise)*1000)).toLocaleString()).split(',')[1]);
  mainFile = mainFile.replace("{%set%}",  ((new Date((newData.sys.sunset)*1000)).toLocaleString()).split(',')[1]);
  mainFile = mainFile.replace("{%country%}", newData.sys.country);
  mainFile = mainFile.replace("{%mintem%}", newData.main.temp_min );
  mainFile = mainFile.replace("{%maxtem%}",newData.main.temp_max );
  console.log(newData.weather[0].description)
  if(newData.weather[0].main=="Clouds"){
    mainFile=mainFile.replace(`<i class="fa-regular fa-sun fa-2xl fa-spin" style="color: #f5970a;"></i>`,'<i class="fa-brands fa-skyatlas fa-bounce fa-2xl" style="color: #c8e3ff;"></i>')
  }
  else if(newData.weather[0].main=="Haze"){
    mainFile=mainFile.replace(`<i class="fa-regular fa-sun fa-2xl fa-spin" style="color: #f5970a;"></i>`,`<i class="fa-solid fa-cloud-sun fa-2xl fa-bounce" style="color: #ffffff;"></i>`)
  } 
  else if(newData.weather[0].main=="Rain"){
    mainFile=mainFile.replace(`<i class="fa-regular fa-sun fa-2xl fa-spin" style="color: #f5970a;"></i>`,`<i class="fa-solid fa-cloud-rain fa-2xl fa-fade" style="color: #6ab5ff;"></i>`)
  } 
}
return mainFile;
}
let newData;
    const server = http.createServer((req, res) => {
        if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const cityName = body.split('=')[1];
          console.log(cityName);
  
          requests(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=988e15380dd0eb226e5767fde70e2a84`)
            .on('data', (chunk) => {
              const data = JSON.parse(chunk);
               newData = replaceVal(mainFile, data);
               if(newData.cod==404){
              res.writeHead(200, { 'Content-type': 'text/html' });
               res.end(newData);  
               }
               else if(newData.cod==400){
                res.writeHead(200, { 'Content-type': 'text/html' });
               res.end(newData);  
               }
               else{
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.end(newData); 
               }
            })
        });
      }
     else if(req.url='/'){
let defaultData;
requests(`https://api.openweathermap.org/data/2.5/weather?q=raipur&units=metric&appid=988e15380dd0eb226e5767fde70e2a84`)
  .on('data', (chunk) => {
    const data = JSON.parse(chunk);
    defaultData = replaceVal(mainFile, data);
    res.end(defaultData);
  })
  .on('end',()=>{
    
  })
}
else{
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('Page not found!');
}
    
    })
    server.listen(3000, '127.0.0.1', () => {
      console.log('Server listening on port 3000');
    });
  
 
  