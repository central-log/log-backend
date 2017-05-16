module.exports = {
	init: function(app){
	/* --------------------Module Domain--------------------------*/
		var province = {
		  "respCode": "_200", 
		  "result": [
		    "上海", 
		    "上海市", 
		    "云南省", 
		    "内蒙古", 
		    "北京市", 
		    "吉林省", 
		    "四川省", 
		    "天津市", 
		    "宁夏", 
		    "安徽省", 
		    "山东省", 
		    "山西省", 
		    "广东省", 
		    "广西省", 
		    "新疆", 
		    "江苏省", 
		    "江西省", 
		    "河北省", 
		    "河南省", 
		    "浙江省", 
		    "海南省", 
		    "湖北省", 
		    "湖南省", 
		    "甘肃省", 
		    "福建省", 
		    "西藏", 
		    "贵州省", 
		    "辽宁省", 
		    "重庆市", 
		    "陕西省", 
		    "青海省", 
		    "黑龙江省"
		  ]
		};
		// userIds seperated by comma
		app.get('/common/provinces', function (req, res) {
			// /domain/:domainId/user?userIds=1,2,3
			res.json(province);
		});

		// Get all menus of domain
		app.get('/common/:abc/cities', function (req, res) {
			res.json({
			  "respCode": "_200", 
			  "result": [
			    "上海",
				  "ddddd"
			  ]
			});
		});

		// Get all menus of domain
		app.get('/common/:id/districts', function (req, res) {
			res.json({
			  "respCode": "_200", 
			  "result": [
			    "黄浦",
				  "HP",
				  "dsdf"
			  ]
			});
		});

	}
}