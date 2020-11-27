var express = require("express")
var app = express()
var fetch = require("node-fetch")
const $ = require('node-html-parser');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 80

// Start server
app.listen(process.env.PORT || HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/dic/:word", async (req, res, next) => {
	try {
		var baseurl = 'https://www.rekhta.org/urdudictionary/?keyword='
		var word = req.params.word
		console.log(word);
		var url = encodeURI(baseurl+word)
		const response = await fetch(url);
            const text = await response.text();                         
            var document = $.parse(text);
			var el = document.querySelector('div.rekhtaDic');
			var msg;
			var data;
			if(el==null) {
				msg = "failed"
				data = "لفظ نہیں ملا۔"
			}
            else {
				msg = "success";				      
      let arr = [];
      el.querySelectorAll('.rekhtaDicSrchWord').forEach((e, i) => {
        
        let en = e.querySelector('.dicSrchWord').innerText;
        let hiUr = e.querySelector('.dicSrchMnng').innerText;
        let enMeaning = e.querySelectorAll('p.dicSrchWrdSyno')[0].innerText;
        let hiMeaning = "";
        if (e.querySelectorAll('p.dicSrchWrdSyno')[1])
          hiMeaning = e.querySelectorAll('p.dicSrchWrdSyno')[1].innerText;
        arr[i] = { en, hiUr, enMeaning, hiMeaning };
      });
      console.log(arr);
				data = arr;
			}
        res.json({
            "message":msg,
            "data":data
        })
}
		catch (err) {
			throw err;
			res.json({
            "message":"failed",
            "data":err
        })
		}
      });

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

