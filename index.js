const {Readfile, Writefile, GetFiles} = require('./lib/file');
const {CleanData, ExtractData} = require('./lib/data');

(async ()=>{
    try{
        let files = await GetFiles();
        files.forEach(async (file) => {       
            let html = await Readfile(file);
            let data = CleanData(html); 
            let result = ExtractData(data);
            Writefile(data,file);
            Writefile(JSON.stringify(result), file.split('.').slice(0,-1).join()+'.json');
        });
        
    }catch(err){
      console.log(err)
    }
})();


