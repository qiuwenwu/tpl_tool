var Tpl = require("mm_tpl");

var config = "./config.json".loadJson();
var {
	ui,
	page,
	template
} = config;

var tpl = new Tpl();
var files_model = ("./models").getFile();

var model = {};


files_model.map((file) =>{
	var arr = file.split("\\");
	var key = arr[arr.length - 1].replace(".json", "");
	model[key] = file.loadJson();
});

var dir_template = "./template/" + template + "/";
var cache_template = "./cache/html/" + template + "/";
("./cache/html/log.json").addDir();
(cache_template + "log.json").addDir();

var files_view = (dir_template).getFile();

files_view.map((file)=> {
	var html = tpl.view(file, Object.assign({JSON}, model));
	("./cache/" + file.replace('template\\', 'html\\')).saveText(html);
});

console.log(model, files_view);