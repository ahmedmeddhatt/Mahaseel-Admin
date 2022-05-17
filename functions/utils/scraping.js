const axios = require('axios');
const cheerio = require('cheerio');

let finalArray = [];
async function test1() {

    for (i = 1; i < 2; i++) {

        axios.get(`https://www.albawabhnews.com/search/term?page=${i}&w=%d8%a7%d9%84%d8%b5%d8%a7%d8%af%d8%b1%d8%a7%d8%aa+%d8%a7%d9%84%d8%b2%d8%b1%d8%a7%d8%b9%d9%8a%d8%a9`)
        .then((res) => {
            let arr=[]
            const $ = cheerio.load(res.data);
            $('.item-card').each((index, element) => {
                const link = ($(element).children().attr('href'));
                
                arr.push('https://www.albawabhnews.com/'+ link)
            })
           return arr

        }).then((arr)=>{
            arr.forEach((el) => {
                axios.get(el).then((res) => {
        
                    const $ = cheerio.load(res.data);
                    $('.cont').each((index, element) => {

                        const title = ($(element).find('h1').text());
                        const desc = ($(element).find('p').text());
                        // const source = 'https://www.albawabhnews.com/search/term?w=%D8%A7%D9%84%D8%B5%D8%A7%D8%AF%D8%B1%D8%A7%D8%AA+%D8%A7%D9%84%D8%B2%D8%B1%D8%A7%D8%B9%D9%8A%D8%A9'

                        if(title&& desc)  finalArray.push({ title, desc , source})
                    })
                    console.log(finalArray)
                })
            })
        });
    }
}

test1()

exports.module = {
    finalArray
}