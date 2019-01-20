# sncf-mail-parser
---
This project is used to parse data from HTML file.
The output data will be generated on the output Folder 

1- Put the email files in html format on the input folder.
2- run `node index.js`
3- Check the output folder

## Tech Stack

* [Node.js][node], [cheerio][cheerio], [JavaScript][js]

## Directory Layout

```bash
.
├── /input/                     # Input Files
├── /output/                    # Ouput Files
├── /lib/                       
│   ├── /data.js                
│   ├── /file.js                
└── index.js                    # App index file
```

## Getting Started
Just clone the repo and run `node index.js`: