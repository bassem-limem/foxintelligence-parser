const fs = require('fs');

/**
 * Get Files
 */
exports.GetFiles = function(){
    return new Promise((resolve, reject) => {
        try {
            fs.readdir('./input/', (err, files) => {
                if (err) {
                    reject(err)
                }
                resolve(files);
            })
        }
        catch (err) { 
            reject(err);
        }
    });
}

/**
 * Reading file from the input Folder
 *  @param {*} file 
 */
exports.Readfile = function(file){
    return new Promise((resolve, reject) => {
        try {
            fs.readFile('./input/'+file, 'utf8', function(err, data) {
                if (err) {
                    reject(err)
                }
                resolve(data.toString());
            });
        }
        catch (err) { 
            reject(err);
        }
    });
}

/**
 * Writing file on path
 * @param {*} file 
 * @param {*} path 
 */
exports.Writefile = function(data, file) {
    fs.writeFile('./output/' + file, data, (err) => {  
        // throws an error
        if (err) throw err;
        // success case, the file was saved
        console.log('\n /output/'+ file + ' Saved!');
    });
}

