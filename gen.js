require("mm_expand");

var config = "./config.json".loadJson();
var {
	ui,
	page,
	new_component
} = config;

var dir_src = `./src/${ui}`.fullname(__dirname);


/**  组件  **/
var dict_component = {};

function load_component() {
	var dirs_components = (dir_src + "components").getDir();
	for (var i = 0; i < dirs_components.length; i++) {
		var dir = dirs_components[i];
		var arr = dir.split("\\");
		var key = arr[arr.length - 2];
		dict_component[key] = dir.getFile();
	}

	(dir_src + "components.json").saveJson(dict_component);
}

// 加载组件
if (new_component) {
	load_component();
} else {
	dict_component = (dir_src + "components.json").loadJson(dict_component);
}


/**  页面  **/
var dict_page = {};

function load_page() {
	var dirs_pages = (dir_src + "pages").getDir();
	for (var i = 0; i < dirs_pages.length; i++) {
		var dir = dirs_pages[i];
		var arr = dir.split("\\");
		var key = arr[arr.length - 2];
		dict_page[key] = dir.getFile();
	}

	(dir_src + "pages.json").saveJson(dict_page);
}

// 页面
if (page) {
	dict_page[page] = (dir_src + "pages/" + page).getFile();
} else if (new_page) {
	load_page();
} else {
	dict_page = (dir_src + "pages.json").loadJson(dict_page);
}



function import_tag(html, tag, files_component) {
	var list = [];
	for (var i = 0; i < files_component.length; i++) {
		var h5 = html.replace(tag, files_component[i].loadText());
		list.push(h5);
	}
	return list;
}


function append_component(html) {
	var list = [html];
	var len = Object.keys(dict_component).length;

	for (var k in dict_component) {
		var tag = `<!-- [${k}] -->`;
		if (html.indexOf(tag) !== -1) {
			var arr = dict_component[k];
			if (arr.length) {
				var lt = [];
				for (var i = 0; i < list.length; i++) {
					var html_tag = list[i];
					lt.addList(import_tag(html_tag, tag, arr));
				}
				list = lt;
			}
		}
	}
	return list;
}

function save_tpl(arr_html, dir, prefix) {
	for (var i = 0; i < arr_html.length; i++) {
		var html = arr_html[i];
		(dir + prefix + (i + 1) + ".html").saveText(html)
	}
}

function create_tpl() {
	var dir_dict = "./dict/" + ui + '/';
	(dir_dict + 'log.josn').addDir();
	for (var k in dict_page) {
		var dir_page = dir_dict + k + "/";
		(dir_page + '/log.josn').addDir();
		var arr_file = dict_page[k];
		for (var i = 0; i < arr_file.length; i++) {
			var file = arr_file[i];
			var html_tag = file.loadText();
			var arr_html = append_component(html_tag + '');
			save_tpl(arr_html, dir_page, k + "_" + (i + 1) + "_");
		}
	}
}

create_tpl();
// for () {
// 	/\<\!--\([a-zA-Z0-9_]+\)--\>/gi.match(html);
// }

// // 页面原型
// var html = "./pages/" + page_name + "/index.html".loadText(__dirname);

// // 配置页头路径
// var dir = "./" + component + "/".fullname(__dirname);

// // 读取模型
// var model = (dir + "model.json").loadJson();

// // 读取视图
// var body = tpl.view(dir + "index.html", model);

// // 渲染页面
// html.replace("<!-- " + component + " -->", body);

// // 将渲染结果保存为页面
// (dir + "tpl_ret/index.htm").saveText(html, __dirname);
