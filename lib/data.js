const cheerio = require('cheerio');

/**
 * Cleaning the html data
 * @param {string} html 
 */
exports.CleanData = function(html){

    html = html.replace(/(\\r?\\n|\\r)/g, '');
    html = html.replace(/(\\")/gm, '"');
    html = html.trim();
    let $ = cheerio.load(html);
    $('#block-header,.hidden').remove();
    $('#right-column').remove();   
    $('#mail-background').find('table').last().remove();
    let result = $.html();
    return result;
}

/**
 * Parsing data from html
 * @param {string} html 
 */
exports.ExtractData = function(html){

    let $ = cheerio.load(html);
  
    let obj = {};
    obj.status = "OK";
    obj.result = {};
    obj.result.trips = [];
    
    let trip = {}
    trip.code = $('table#block-travel tr:first-child td:first-child').find('table').eq(-4).find('table tr:first-child td:first-child span').text().trim();
    trip.name = $('table#block-travel tr:first-child td:first-child').find('table tr:nth-child(2) td:nth-child(2) span').html().trim();
    trip.details = [];

        let detail = {};
        detail.price = Number.parseFloat($('table#block-payment tr:first-child td:first-child').find('table').eq(-1).find('tr:first-child td:last-child').text().replace(',', '.'));
        detail.roundTrips = [];          
            //Parsing Trips
            $('#block-command tr:first-child td:first-child table').each(function() {
                let colorTableBorder = $(this).css('border');//expected 1px solid #4d4f53;
                let countTd    = $(this).children('tbody').children('tr').children('td').length; //expected 9 
                //Parsing trip
                if(colorTableBorder == '1px solid #4d4f53' && countTd == 9){
                    let roundTrip = {};
                    roundTrip.type = $(this).find('tr:first-child td:first-child').text().trim();
                    roundTrip.date = "";
                    roundTrip.trains = [];
                    roundTrip.passengers = [];
                    //Parsing Train
                    let train = {};
                    train.departureTime = $(this).find('tr:first-child td:nth-child(2)').text().trim();
                    train.departureStation = $(this).find('tr:first-child td:nth-child(3)').text().trim();
                    train.arrivalTime = $(this).find('tr:nth-child(2) td:first-child').html().trim();
                    train.arrivalStation = $(this).find('tr:nth-child(2) td:nth-child(2)').text().trim();
                    train.type = $(this).find('tr:first-child td:nth-child(4)').text().trim();
                    train.number = $(this).find('tr:first-child td:nth-child(5)').text().trim();
                    roundTrip.trains.push(train);
                    detail.roundTrips.push(roundTrip);
                    let bgc = $(this).next('table');

                    if(bgc.css('background-color') == '#e0e1dd'){
                        bgc.find('tr').each(function() {
                            let src = $(this).find('td').eq(0).find('img').attr('src');
                            let bool = (src != undefined && src.indexOf("arrow-blue.png") > 0) ? true : false;
                            if(bool){
                                let passenger = {};
                                let text = $(this).find('td').eq(2).text().trim();
                                text = text.replace("Billet non échangeable et non remboursable après le départ.","");
                                if(text.includes('Billet non échangeable')){
                                    passenger.type = 'non échangeable';
                                }else{
                                    passenger.type = 'échangeable';
                                }
                                passenger.age = "("+$(this).find('td').eq(1).text().trim().match(/\(([^)]+)\)/)[1]+")";
                                roundTrip.passengers.push(passenger);
                            }
                        });
                    }              
                }
            });
        trip.details.push(detail);

    obj.result.trips.push(trip);
    obj.result.custom = {};
    obj.result.custom.prices = [];

    $('#block-command tr:first-child td:first-child table').each(function() {
        let colorTable = $(this).css( 'background-color' );// expected #e05206
        let countTd    = $(this).children('tbody').children('tr').children('td').length;
        //Parsing prices
        if(colorTable == '#e05206' && countTd == 7){
            let price = Number.parseFloat($(this).find('tbody tr:first-child td:last-child').text().replace(',', '.'));
            obj.result.custom.prices.push({"value" : price });
        }
    });
    //Parsing prices
    let price = Number.parseFloat($("tr.product-header").find('td.amount').text().replace(',', '.'));
    obj.result.custom.prices.push({"value" : price });  
    return obj;
     
}